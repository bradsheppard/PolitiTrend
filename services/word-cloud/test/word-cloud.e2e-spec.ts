import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { WordCloudService } from '../src/word-cloud/word-cloud.service';
import * as request from 'supertest';
import { WordCloud } from '../src/word-cloud/interfaces/word-cloud.interface';
import { CreateWordCloudDto } from '../src/word-cloud/dto/create-word-cloud.dto';
import waitForExpect from 'wait-for-expect';

let app: INestApplication;
let service: WordCloudService;
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

	service = moduleFixture.get<WordCloudService>(WordCloudService);
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

function createWordCloud(): CreateWordCloudDto {
	id++;
	return {
		politician: id,
		words: [{
			word: `Test word ${id}`,
			count: id
		}]
	} as CreateWordCloudDto
}

function equals(wordCloud: WordCloud, wordCloudDto: CreateWordCloudDto) {
	for(let i = 0; i < wordCloud.words.length; i++) {
		const word = wordCloud.words[i];
		const dtoWord = wordCloudDto.words[i];
		expect(word.word).toEqual(dtoWord.word);
		expect(word.count).toEqual(dtoWord.count);
	}

	expect(wordCloud.politician).toEqual(wordCloudDto.politician);
	expect(wordCloud.dateTime).not.toBeNull();
}

describe('WordCloudController (e2e)', () => {
	it('/ (GET)', async () => {
		const createDto = createWordCloud();
		await service.create(createDto);

		const response = await request(app.getHttpServer())
			.get('/');

		expect(response.status).toEqual(200);
	});

	it('/?politician={id} (GET)', async() => {
		const createDto1 = createWordCloud();
		const createDto2 = createWordCloud();

		await service.create(createDto1);
		await service.create(createDto2);

		const response = await request(app.getHttpServer())
			.get(`/?politician=${createDto1.politician}`);

		expect(response.status).toEqual(200);
		equals(response.body[0], createDto1);
	});

	it('/ (POST)', async() => {
		const createDto = createWordCloud();
		const res = await request(app.getHttpServer())
			.post('/')
			.send(createDto);

		const resultingWordCloud = res.body as WordCloud;
		equals(resultingWordCloud, createDto);
	});

	it('/?limit=1 (GET)', async() => {
		const createDto1 = createWordCloud();
		const createDto2 = createWordCloud();

		await service.create(createDto1);
		await service.create(createDto2);

		const response = await request(app.getHttpServer())
			.get('/?limit=1');

		expect(response.status).toEqual(200);
		equals(response.body[0], createDto2);
	});

	it('/?limit=1&offset=1 (GET)', async() => {
		const createDto1 = createWordCloud();
		const createDto2 = createWordCloud();

		await service.create(createDto1);
		await service.create(createDto2);

		const response = await request(app.getHttpServer())
			.get('/?limit=1&offset=1');

		expect(response.status).toEqual(200);
		equals(response.body[0], createDto1);
	});

	it('handle word cloud created', async () => {
		const createWordCloudDto = createWordCloud();
		const json = await client.emit('word-cloud-created', createWordCloudDto).toPromise();

		expect(json[0].topicName).toEqual('word-cloud-created');

		await waitForExpect(async () => {
			const wordClouds: WordCloud[] = await service.find({});
			expect(wordClouds.length).toEqual(1);
			equals(wordClouds[0], createWordCloudDto);
		});
	});
});
