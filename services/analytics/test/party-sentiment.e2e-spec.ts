import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PartySentimentService } from '../src/party-sentiment/party-sentiment.service';
import * as request from 'supertest';
import { CreatePartySentimentDto } from '../src/party-sentiment/dtos/create-party-sentiment.dto';
import { PartySentiment } from '../src/party-sentiment/interfaces/party-sentiment.interface';
import waitForExpect from 'wait-for-expect';

let app: INestApplication;
let service: PartySentimentService;
let client: ClientProxy;

jest.setTimeout(120000);

beforeAll(async () => {
	const name = {
		name: 'PARTY_SENTIMENT_SERVICE',
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
	app.useGlobalPipes(new ValidationPipe({ transform: true, skipMissingProperties: true }));
	app.connectMicroservice(microserviceConfig);

	service = moduleFixture.get<PartySentimentService>(PartySentimentService);
	client = app.get('PARTY_SENTIMENT_SERVICE');

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

function createSentiment(): CreatePartySentimentDto {
	id++;
	return {
		sentiment: id,
		party: `TestParty${id}`,
		sampleSize: id + 100,
	};
}

function createSentimentWithSampleSizeForParty(
	party: number,
	sampleSize: number,
): CreatePartySentimentDto {
	id++;
	return {
		sentiment: id,
		party: `TestParty${party}`,
		sampleSize,
	};
}

function equals(sentiment: PartySentiment, sentimentDto: CreatePartySentimentDto) {
	expect(sentiment.sentiment).toEqual(sentimentDto.sentiment);
	expect(sentiment.party).toEqual(sentimentDto.party);
	expect(sentiment.sampleSize).toEqual(sentimentDto.sampleSize);
}

function equalsWithDate(sentiment: PartySentiment, sentimentDto: CreatePartySentimentDto) {
	expect(sentiment.sentiment).toEqual(sentimentDto.sentiment);
	expect(sentiment.party).toEqual(sentimentDto.party);
	expect(sentiment.sampleSize).toEqual(sentimentDto.sampleSize);
	expect(sentiment.dateTime).toEqual(sentimentDto.dateTime.toISOString());
}

describe('Party Sentiment (e2e)', () => {
	it('/party-sentiment (GET)', async () => {
		const currentDate = new Date('2020-01-02');
		const yesterday = new Date('2020-01-01');

		const party1CreatePartySentimentDto1: CreatePartySentimentDto = {
			sentiment: 1,
			sampleSize: 100,
			party: 'TestParty1',
			dateTime: currentDate,
		};
		const party1CreatePartySentimentDto2: CreatePartySentimentDto = {
			sentiment: 2,
			sampleSize: 200,
			party: 'TestParty1',
			dateTime: yesterday,
		};

		const party2CreatePartySentimentDto1: CreatePartySentimentDto = {
			sentiment: 1,
			sampleSize: 100,
			party: 'TestParty2',
			dateTime: currentDate,
		};
		const party2CreatePartySentimentDto2: CreatePartySentimentDto = {
			sentiment: 2,
			sampleSize: 200,
			party: 'TestParty2',
			dateTime: yesterday,
		};

		await Promise.all([
			service.create(party1CreatePartySentimentDto1),
			service.create(party1CreatePartySentimentDto2),
			service.create(party2CreatePartySentimentDto1),
			service.create(party2CreatePartySentimentDto2),
		]);

		const expectedResponse = [
			party1CreatePartySentimentDto1,
			party1CreatePartySentimentDto2,
			party2CreatePartySentimentDto1,
			party2CreatePartySentimentDto2,
		];

		const response = await request(app.getHttpServer()).get('/party-sentiment');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(4);
		for (let i = 0; i < response.body.length; i++) {
			equalsWithDate(response.body[i], expectedResponse[i]);
		}
	});

	it('/party-sentiment?party={id} (GET) One day', async () => {
		const currentDate = new Date('2020-01-02');
		const yesterday = new Date('2020-01-01');

		const party1CreatePartySentimentDto1: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 100,
			sentiment: 1,
			dateTime: currentDate,
		};
		const party1CreatePartySentimentDto2: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 200,
			sentiment: 4,
			dateTime: yesterday,
		};

		const party2CreatePartySentimentDto1: CreatePartySentimentDto = {
			party: 'TestParty2',
			sampleSize: 300,
			sentiment: 5,
			dateTime: currentDate,
		};
		const party2CreatePartySentimentDto2: CreatePartySentimentDto = {
			party: 'TestParty2',
			sampleSize: 400,
			sentiment: 6,
			dateTime: yesterday,
		};

		const expectedResponse = [party1CreatePartySentimentDto1, party1CreatePartySentimentDto2];

		await Promise.all([
			service.create(party1CreatePartySentimentDto1),
			service.create(party1CreatePartySentimentDto2),
			service.create(party2CreatePartySentimentDto1),
			service.create(party2CreatePartySentimentDto2),
		]);

		const response = await request(app.getHttpServer()).get('/party-sentiment?party=TestParty1');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(2);
		for (let i = 0; i < response.body.length; i++) {
			equals(response.body[i], expectedResponse[i]);
		}
	});

	it('/party-sentiment?party={id}&resample=86400000 (GET) One day with resampling', async () => {
		const party1CreatePartySentimentDto1: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 100,
			sentiment: 1,
		};
		const party1CreatePartySentimentDto2: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 200,
			sentiment: 4,
		};

		const party2CreatePartySentimentDto1: CreatePartySentimentDto = {
			party: 'TestParty2',
			sampleSize: 300,
			sentiment: 5,
		};
		const party2CreatePartySentimentDto2: CreatePartySentimentDto = {
			party: 'TestParty2',
			sampleSize: 400,
			sentiment: 6,
		};

		const expectedResponse = [
			{
				party: 'TestParty1',
				sampleSize: 150,
				sentiment: 3,
			},
		];

		await Promise.all([
			service.create(party1CreatePartySentimentDto1),
			service.create(party1CreatePartySentimentDto2),
			service.create(party2CreatePartySentimentDto1),
			service.create(party2CreatePartySentimentDto2),
		]);

		const response = await request(app.getHttpServer()).get(
			'/party-sentiment?party=TestParty1&resample=86400000',
		);

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(1);
		for (let i = 0; i < response.body.length; i++) {
			equals(response.body[i], expectedResponse[i]);
		}
	});

	it('/party-sentiment?party={id}&start=2020-01-01&resample=86400000 (GET) Multiple day downsampling', async () => {
		const currentDate = new Date('2020-01-02');
		const yesterday = new Date('2020-01-01');

		const party1CreatePartySentimentDto1: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 100,
			sentiment: 1,
			dateTime: currentDate,
		};
		const party1CreatePartySentimentDto2: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 200,
			sentiment: 4,
			dateTime: currentDate,
		};

		const party1CreatePartySentimentDto3: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 500,
			sentiment: 1,
			dateTime: yesterday,
		};
		const party1CreatePartySentimentDto4: CreatePartySentimentDto = {
			party: 'TestParty1',
			sampleSize: 1500,
			sentiment: 4,
			dateTime: yesterday,
		};

		const party2CreatePartySentimentDto1: CreatePartySentimentDto = {
			party: 'TestParty2',
			sampleSize: 300,
			sentiment: 5,
		};
		const party2CreatePartySentimentDto2: CreatePartySentimentDto = {
			party: 'TestParty2',
			sampleSize: 400,
			sentiment: 6,
		};

		const expectedResponse = [
			{
				party: 'TestParty1',
				sampleSize: 150,
				sentiment: 3,
				dateTime: currentDate,
			},
			{
				party: 'TestParty1',
				sampleSize: 1000,
				sentiment: 3.25,
				dateTime: yesterday,
			},
		];

		await Promise.all([
			service.create(party1CreatePartySentimentDto1),
			service.create(party1CreatePartySentimentDto2),
			service.create(party1CreatePartySentimentDto3),
			service.create(party1CreatePartySentimentDto4),
			service.create(party2CreatePartySentimentDto1),
			service.create(party2CreatePartySentimentDto2),
		]);

		const response = await request(app.getHttpServer()).get(
			'/party-sentiment?party=TestParty1&start=2020-01-01&resample=86400000',
		);

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(expectedResponse.length);

		for (let i = 0; i < response.body.length; i++) {
			equals(response.body[i], expectedResponse[i]);
		}
	});

	it('/party-sentiment?minSampleSize=3 (GET)', async () => {
		const party1CreatePartySentimentDto = createSentimentWithSampleSizeForParty(1, 4);
		const party2CreatePartySentimentDto = createSentimentWithSampleSizeForParty(2, 1);

		await Promise.all([
			service.create(party1CreatePartySentimentDto),
			service.create(party2CreatePartySentimentDto),
		]);

		const response = await request(app.getHttpServer()).get('/party-sentiment?minSampleSize=3');

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(1);
		equals(response.body[0], party1CreatePartySentimentDto);
	});

	it('/party-sentiment (POST)', async () => {
		const createDto = createSentiment();
		const res = await request(app.getHttpServer())
			.post('/party-sentiment')
			.send(createDto);

		const resultingSentiment = res.body as PartySentiment;
		equals(resultingSentiment, createDto);
	});

	it('handle party sentiment created', async () => {
		const createDto = createSentiment();
		const json = await client.emit('analytics-party-sentiment-created', createDto).toPromise();

		expect(json[0].topicName).toEqual('analytics-party-sentiment-created');

		await waitForExpect(async () => {
			const sentiments: PartySentiment[] = await service.find({});
			expect(sentiments.length).toEqual(1);
			equals(sentiments[0], createDto);
		});
	});
});
