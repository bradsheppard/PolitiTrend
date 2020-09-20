import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SentimentService } from '../src/sentiment/sentiment.service';
import * as request from 'supertest';
import { CreateSentimentDto } from '../src/sentiment/dtos/create-sentiment.dto';
import { Sentiment } from '../src/sentiment/interfaces/sentiment.interface';
import waitForExpect from 'wait-for-expect';

let app: INestApplication;
let service: SentimentService;
let client: ClientProxy;

jest.setTimeout(120000);

beforeAll(async () => {
	const name = {
		name: 'SENTIMENT_SERVICE',
	};

	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			AppModule,
			ClientsModule.register([
				{
					...microserviceConfig,
					...name,
				} as ClientProviderOptions,
			]),
		],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.useGlobalPipes(new ValidationPipe({transform: true, skipMissingProperties: true}));
	app.connectMicroservice(microserviceConfig);

	service = moduleFixture.get<SentimentService>(SentimentService);
	client = app.get('SENTIMENT_SERVICE');

	await app.init();
	await app.startAllMicroservicesAsync();

	await client.connect();
});

afterAll(async () => {
	await client.close();
	await app.close();
});

beforeEach(async () => {
	await service.delete();
});

let id = 0;

function createSentiment(): CreateSentimentDto {
	id++;
	return {
		sentiment: id,
		politician: id,
		sampleSize: id + 100
	}
}

function createSentimentWithSampleSizeForPolitician(politician: number, sampleSize: number): CreateSentimentDto {
	id++;
	return {
		sentiment: id,
		politician,
		sampleSize
	}
}

function equals(sentiment: Sentiment, sentimentDto: CreateSentimentDto) {
	expect(sentiment.sentiment).toEqual(sentimentDto.sentiment);
	expect(sentiment.politician).toEqual(sentimentDto.politician);
	expect(sentiment.sampleSize).toEqual(sentimentDto.sampleSize);
}

function equalsWithDate(sentiment: Sentiment, sentimentDto: CreateSentimentDto) {
	expect(sentiment.sentiment).toEqual(sentimentDto.sentiment);
	expect(sentiment.politician).toEqual(sentimentDto.politician);
	expect(sentiment.sampleSize).toEqual(sentimentDto.sampleSize);
	expect(sentiment.dateTime).toEqual(sentimentDto.dateTime.toISOString());
}

describe('Sentiment (e2e)', () => {
	it('/sentiment (GET)', async () => {
		const currentDate = new Date('2020-01-02');
		const yesterday = new Date('2020-01-01');

		const politician1CreateSentimentDto1: CreateSentimentDto = {
			sentiment: 1,
			sampleSize: 100,
			politician: 1,
			dateTime: currentDate
		};
		const politician1CreateSentimentDto2: CreateSentimentDto = {
			sentiment: 2,
			sampleSize: 200,
			politician: 1,
			dateTime: yesterday
		};

		const politician2CreateSentimentDto1: CreateSentimentDto = {
			sentiment: 1,
			sampleSize: 100,
			politician: 2,
			dateTime: currentDate
		};
		const politician2CreateSentimentDto2: CreateSentimentDto = {
			sentiment: 2,
			sampleSize: 200,
			politician: 2,
			dateTime: yesterday
		};

		await Promise.all([
			service.create(politician1CreateSentimentDto1),
			service.create(politician1CreateSentimentDto2),
			service.create(politician2CreateSentimentDto1),
			service.create(politician2CreateSentimentDto2)
		]);

		const expectedResponse = [
			politician1CreateSentimentDto1,
			politician1CreateSentimentDto2,
			politician2CreateSentimentDto1,
			politician2CreateSentimentDto2
		]

		const response = await request(app.getHttpServer())
			.get('/sentiment');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(4);
		for(let i = 0; i < response.body.length; i++) {
			equalsWithDate(response.body[i], expectedResponse[i]);
		}
	});

	it('/sentiment?politician={id} (GET) One day downsampling', async () => {
		const politician1CreateSentimentDto1: CreateSentimentDto = {
			politician: 1,
			sampleSize: 100,
			sentiment: 1
		};
		const politician1CreateSentimentDto2: CreateSentimentDto = {
			politician: 1,
			sampleSize: 200,
			sentiment: 4
		};

		const politician2CreateSentimentDto1: CreateSentimentDto = {
			politician: 2,
			sampleSize: 300,
			sentiment: 5
		};
		const politician2CreateSentimentDto2: CreateSentimentDto = {
			politician: 2,
			sampleSize: 400,
			sentiment: 6
		};

		const expectedResponse = {
			politician: 1,
			sampleSize: 300,
			sentiment: 3
		};

		await Promise.all([
			service.create(politician1CreateSentimentDto1),
			service.create(politician1CreateSentimentDto2),
			service.create(politician2CreateSentimentDto1),
			service.create(politician2CreateSentimentDto2)
		]);

		const response = await request(app.getHttpServer())
			.get('/sentiment?politician=1');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(1);
		equals(response.body[0], expectedResponse);
	});

	it('/sentiment?politician={id} (GET) Multiple day downsampling', async () => {
		const currentDate = new Date('2020-01-02');
		const yesterday = new Date('2020-01-01');

		const politician1CreateSentimentDto1: CreateSentimentDto = {
			politician: 1,
			sampleSize: 100,
			sentiment: 1,
			dateTime: currentDate
		};
		const politician1CreateSentimentDto2: CreateSentimentDto = {
			politician: 1,
			sampleSize: 200,
			sentiment: 4,
			dateTime: currentDate
		};

		const politician1CreateSentimentDto3: CreateSentimentDto = {
			politician: 1,
			sampleSize: 500,
			sentiment: 1,
			dateTime: yesterday
		};
		const politician1CreateSentimentDto4: CreateSentimentDto = {
			politician: 1,
			sampleSize: 1500,
			sentiment: 4,
			dateTime: yesterday
		};

		const politician2CreateSentimentDto1: CreateSentimentDto = {
			politician: 2,
			sampleSize: 300,
			sentiment: 5
		};
		const politician2CreateSentimentDto2: CreateSentimentDto = {
			politician: 2,
			sampleSize: 400,
			sentiment: 6
		};

		const expectedResponse = [
			{
				politician: 1,
				sampleSize: 300,
				sentiment: 3,
				dateTime: currentDate
			},
			{
				politician: 1,
				sampleSize: 2000,
				sentiment: 3.25,
				dateTime: yesterday
			}
		];

		await Promise.all([
			service.create(politician1CreateSentimentDto1),
			service.create(politician1CreateSentimentDto2),
			service.create(politician1CreateSentimentDto3),
			service.create(politician1CreateSentimentDto4),
			service.create(politician2CreateSentimentDto1),
			service.create(politician2CreateSentimentDto2)
		]);

		const response = await request(app.getHttpServer())
			.get('/sentiment?politician=1&start=2020-01-01');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(expectedResponse.length);

		for(let i = 0; i < response.body.length; i++) {
			equalsWithDate(response.body[i], expectedResponse[i]);
		}
	});

	it('/sentiment?minSampleSize=3 (GET)', async() => {
		const politician1CreateSentimentDto = createSentimentWithSampleSizeForPolitician(1, 4);
		const politician2CreateSentimentDto = createSentimentWithSampleSizeForPolitician(2, 1);

		await Promise.all([
			service.create(politician1CreateSentimentDto),
			service.create(politician2CreateSentimentDto)
		]);

		const response = await request(app.getHttpServer())
			.get('/sentiment?minSampleSize=3');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(1);
		equals(response.body[0], politician1CreateSentimentDto);
	});

	it('/sentiment (POST)', async () => {
		const createDto = createSentiment();
		const res = await request(app.getHttpServer())
			.post('/sentiment')
			.send(createDto);

		const resultingSentiment = res.body as Sentiment;
		equals(resultingSentiment, createDto);
	});

	it('handle sentiment created', async () => {
		const createDto = createSentiment();
		const json = await client.emit('analytics-sentiment-created', createDto).toPromise();

		expect(json[0].topicName).toEqual('analytics-sentiment-created');

		await waitForExpect(async () => {
			const sentiments: Sentiment[] = await service.find({});
			expect(sentiments.length).toEqual(1);
			equals(sentiments[0], createDto);
		});
	});
});
