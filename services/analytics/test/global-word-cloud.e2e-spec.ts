import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalWordCloudService } from '../src/global-word-cloud/global-word-cloud.service';
import * as request from 'supertest';
import { GlobalWordCloud } from '../src/global-word-cloud/interfaces/global-word-cloud.interface';
import { CreateGlobalWordCloudDto } from '../src/global-word-cloud/dtos/create-global-word-cloud.dto';
import waitForExpect from 'wait-for-expect';

let app: INestApplication;
let service: GlobalWordCloudService;
let client: ClientProxy;

jest.setTimeout(120000);

beforeAll(async () => {
	const name = {
		name: 'WORD_CLOUD_SERVICE',
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

	service = moduleFixture.get<GlobalWordCloudService>(GlobalWordCloudService);
	client = app.get('WORD_CLOUD_SERVICE');

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

let id = 1;

function createWordCloud(): CreateGlobalWordCloudDto {
	id++;
	return {
		politician: id,
		words: [{
			word: `Test word ${id}`,
			count: id
		}]
	} as CreateGlobalWordCloudDto
}

function equals(wordCloud: GlobalWordCloud, wordCloudDto: CreateGlobalWordCloudDto) {
	for(let i = 0; i < wordCloud.words.length; i++) {
		const word = wordCloud.words[i];
		const dtoWord = wordCloudDto.words[i];
		expect(word.word).toEqual(dtoWord.word);
		expect(word.count).toEqual(dtoWord.count);
	}

	expect(wordCloud.dateTime).not.toBeNull();
}

describe('GlobalWordCloudController (e2e)', () => {
	it('/global-word-cloud (GET)', async () => {
		const createDto = createWordCloud();
		await service.create(createDto);

		const response = await request(app.getHttpServer())
			.get('/global-word-cloud');

		expect(response.status).toEqual(200);
	});

	it('/global-word-cloud?limit=1 (GET)', async() => {
		const createDto1 = createWordCloud();
		const createDto2 = createWordCloud();

		await service.create(createDto1);
		await service.create(createDto2);

		const response = await request(app.getHttpServer())
			.get(`/global-word-cloud?limit=1`);

		expect(response.status).toEqual(200);
		expect(response.body.length).toEqual(1);
		equals(response.body[0], createDto2);
	});

	it('/global-word-cloud (POST)', async() => {
		const createDto = createWordCloud();
		const res = await request(app.getHttpServer())
			.post('/global-word-cloud')
			.send(createDto);

		const resultingWordCloud = res.body as GlobalWordCloud;
		equals(resultingWordCloud, createDto);
	});

	it('/global-word-cloud?limit=1 (GET)', async() => {
		const createDto1 = createWordCloud();
		const createDto2 = createWordCloud();

		await service.create(createDto1);
		await service.create(createDto2);

		const response = await request(app.getHttpServer())
			.get('/global-word-cloud?limit=1');

		expect(response.status).toEqual(200);
		equals(response.body[0], createDto2);
	});

	it('/global-word-cloud?limit=1&offset=1 (GET)', async() => {
		const createDto1 = createWordCloud();
		const createDto2 = createWordCloud();

		await service.create(createDto1);
		await service.create(createDto2);

		const response = await request(app.getHttpServer())
			.get('/global-word-cloud?limit=1&offset=1');

		expect(response.status).toEqual(200);
		equals(response.body[0], createDto1);
	});

	it('handle word cloud created', async () => {
		const createWordCloudDto = createWordCloud();
		const json = await client.emit('analytics-global-word-cloud-created', createWordCloudDto).toPromise();

		expect(json[0].topicName).toEqual('analytics-global-word-cloud-created');

		await waitForExpect(async () => {
			const wordClouds: GlobalWordCloud[] = await service.find({});
			expect(wordClouds.length).toEqual(1);
			equals(wordClouds[0], createWordCloudDto);
		});
	});
});
