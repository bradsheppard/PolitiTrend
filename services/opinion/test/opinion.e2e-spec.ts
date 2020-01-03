import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateOpinionDto } from '../src/opinion/dto/create-opinion.dto';
import Opinion from '../src/opinion/opinion.entity';
import { OpinionService } from '../src/opinion/opinion.service';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import microserviceConfig from '../src/config/config.microservice';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import waitForExpect from 'wait-for-expect';
waitForExpect.defaults.timeout = 20000;
jest.setTimeout(60000);

let app: INestApplication;
let service: OpinionService;
let client: ClientProxy;

let id = 0;

function createOpinionDto() {
	id++;
	return {
		tweetText: `test text ${id}`,
		sentiment: id + 0.25,
		tweetId: id.toString(),
		politician: id,
	} as CreateOpinionDto;
}

beforeAll(async () => {
	const name = {
		name: 'OPINION_SERVICE',
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
	app.connectMicroservice(microserviceConfig);

	service = moduleFixture.get<OpinionService>(OpinionService);
	client = app.get('OPINION_SERVICE');

	await app.init();
	await app.startAllMicroservicesAsync();

	await client.connect();
});

afterAll(async () => {
	await app.close();
	await client.close();
});

beforeEach(async () => {
	await service.delete();
});

afterEach(() => {
	jest.resetAllMocks();
});

describe('OpinionController (e2e)', () => {

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
		  .get('/');

		expect(response.status).toEqual(200);
	});

	it('/ (POST)', async () => {
		const opinionDto = createOpinionDto();
		const res = await request(app.getHttpServer())
			.post('/')
			.send(opinionDto);

		const resultingOpinion = res.body as Opinion;
		const insertedOpinion = opinionDto as Opinion;
		insertedOpinion.id = resultingOpinion.id;

		expect(res.status).toEqual(201);
		expect(resultingOpinion).toEqual(insertedOpinion);
	});

	it('/:id (GET)', async () => {
		const opinionDto = createOpinionDto();
		const postResponse = await request(app.getHttpServer())
			.post('/')
			.send(opinionDto);

		const resultingOpinion = postResponse.body as Opinion;
		const getResponse = await request(app.getHttpServer())
			.get(`/${resultingOpinion.id}`);

		expect(getResponse.status).toEqual(200);
		expect(getResponse.body).toEqual(resultingOpinion);
	});

	it('/:id (DELETE)', async () => {
		const opinionDto = createOpinionDto();
		const postResponse = await request(app.getHttpServer())
			.post('/')
			.send(opinionDto);

		const resultingOpinion = postResponse.body as Opinion;

		const deleteResponse = await request(app.getHttpServer())
			.delete(`/${resultingOpinion.id}`);
		const getResponse = await request(app.getHttpServer())
			.get(`/${resultingOpinion.id}`);

		expect(deleteResponse.status).toEqual(200);
		expect(getResponse.status).toEqual(404);
	});

	it('handle opinion created', async () => {
		const opinionDto = createOpinionDto();
		const json = await client.emit('opinion_created', opinionDto).toPromise();

		expect(json[0].topicName).toEqual('opinion_created');

		await waitForExpect(async () => {
			const opinions: Opinion[] = await service.get();
			expect(opinions.length).toEqual(1);
		});
	});
});

describe('OpinionService (e2e)', () => {

	function createOpinion() {
		id++;
		return {
			tweetText: `test text ${id}`,
			sentiment: id + 0.25,
			tweetId: id.toString(),
			politician: id,
		} as Opinion;
	}

	function createOpinionForPolitician(politicianId: number, sentiment: number) {
		id++;
		return {
			tweetText: `test text ${id}`,
			sentiment,
			tweetId: id.toString(),
			politician: politicianId,
		} as Opinion;
	}

	it('Can get all', async () => {
		const opinion1 = createOpinion();
		const opinion2 = createOpinion();

		const firstInsert = await service.insert(opinion1);
		const secondInsert = await service.insert(opinion2);

		const Opinions = await service.get({});

		expect(Opinions).toEqual([firstInsert, secondInsert]);
	});

	it('Can get', async () => {
		const opinion = createOpinion();
		const insertedOpinion = await service.insert(opinion);
		opinion.id = insertedOpinion.id;

		const retrievedOpinion = await service.getOne(insertedOpinion.id);
		expect(retrievedOpinion).toEqual(insertedOpinion);
		expect(insertedOpinion).toEqual(opinion);
	});

	it('Can get by politician', async () => {
		const opinion = createOpinion();
		const insertedOpinion = await service.insert(opinion);

		const politicianOpinions = await service.get({politician: insertedOpinion.politician});

		for (const politician of politicianOpinions) {
			expect(politician.politician).toEqual(insertedOpinion.politician);
		}
	});

	it('Can delete', async () => {
		const opinion = createOpinion();
		const insertedOpinion = await service.insert(opinion);
		await service.deleteOne(insertedOpinion.id);

		const opinions: Opinion[] = await service.get({id: insertedOpinion.id});

		expect(opinions).toHaveLength(0);
	});

	it('Can update', async () => {
		const opinion = createOpinion();
		const insertedOpinion = await service.insert(opinion);
		insertedOpinion.tweetText = 'New tweet text';
		await service.update(insertedOpinion);

		const updatedOpinion = await service.getOne(insertedOpinion.id);

		expect(updatedOpinion).toEqual(insertedOpinion);
	});

	it('Can upsert on tweet Id, new tweet inserted', async () => {
		const opinion = createOpinion();

		const upsertedOpinion = await service.upsertOnTweetId(opinion);

		const retrievedOpinion = await service.getOne(upsertedOpinion.id);
		expect(retrievedOpinion).toEqual(opinion);
	});

	it('Can upsert on tweet Id, existing tweet updated', async () => {
		const opinion = createOpinion();

		const insertedOpinion = await service.insert(opinion);
		insertedOpinion.tweetText = 'Some new text';

		await service.upsertOnTweetId(insertedOpinion);

		const retrievedOpinion = await service.getOne(insertedOpinion.id);
		expect(retrievedOpinion).toEqual(insertedOpinion);
	});

	it('Can get sentiment average', async () => {
		const testOpinion1 = createOpinionForPolitician(60, 6.5);
		const testOpinion2 = createOpinionForPolitician(60, 9);

		await service.insert(testOpinion1);
		await service.insert(testOpinion2);

		const averageSentiment = await service.getSentimentAverageForPolitician(60);
		expect(averageSentiment).toEqual(7.75);
	});

	it('Can get sentiment average, nonexistent politician', async () => {
		const testOpinion1 = createOpinionForPolitician(62, 6.5);
		const testOpinion2 = createOpinionForPolitician(62, 9);

		await service.insert(testOpinion1);
		await service.insert(testOpinion2);

		const averageSentiment = await service.getSentimentAverageForPolitician(999);
		expect(averageSentiment).toBeNull();
	});

	it('Can get sentiment average when no politicians', async () => {
		await service.delete();

		const averageSentiment = await service.getSentimentAverageForPolitician(1);
		expect(averageSentiment).toBeNull();
	});
});
