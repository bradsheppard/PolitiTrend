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

function createSentimentForPolitician(politician: number): CreateSentimentDto {
	id++;
	return {
		sentiment: id,
		politician,
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

describe('Sentiment (e2e)', () => {
	it('/sentiment (GET)', async () => {
		const politician1CreateSentimentDto1 = createSentimentForPolitician(1);
		const politician1CreateSentimentDto2 = createSentimentForPolitician(1);

		const politician2CreateSentimentDto1 = createSentimentForPolitician(2);
		const politician2CreateSentimentDto2 = createSentimentForPolitician(2);

		await service.create(politician1CreateSentimentDto1);
		await service.create(politician1CreateSentimentDto2);
		await service.create(politician2CreateSentimentDto1);
		await service.create(politician2CreateSentimentDto2);

		const response = await request(app.getHttpServer())
			.get('/sentiment');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(2);
		equals(response.body[0], politician1CreateSentimentDto2);
		equals(response.body[1], politician2CreateSentimentDto2);
	});

	it('/sentiment?politician={id} (GET)', async () => {
		const politician1CreateSentimentDto1 = createSentimentForPolitician(1);
		const politician1CreateSentimentDto2 = createSentimentForPolitician(1);

		const politician2CreateSentimentDto1 = createSentimentForPolitician(2);
		const politician2CreateSentimentDto2 = createSentimentForPolitician(2);

		await service.create(politician1CreateSentimentDto1);
		await service.create(politician1CreateSentimentDto2);
		await service.create(politician2CreateSentimentDto1);
		await service.create(politician2CreateSentimentDto2);

		const response = await request(app.getHttpServer())
			.get('/sentiment?politician=1');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(2);
		equals(response.body[0], politician1CreateSentimentDto2);
		equals(response.body[1], politician1CreateSentimentDto1);
	});

	it('/sentiment?minSampleSize=3 (GET', async() => {
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
			const sentiments: Sentiment[] = await service.findAll();
			expect(sentiments.length).toEqual(1);
			equals(sentiments[0], createDto);
		});
	});
});
