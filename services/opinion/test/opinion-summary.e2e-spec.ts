import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { OpinionSummaryService } from '../src/opinion-summary/opinion-summary.service';
import * as request from 'supertest';
import OpinionSummary from '../src/opinion-summary/opinion-summary.entity';

let app: INestApplication;
let service: OpinionSummaryService;

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	service = moduleFixture.get<OpinionSummaryService>(OpinionSummaryService);

	await app.init();
});

afterAll(async () => {
	await app.close();
});

beforeEach(async () => {
	await service.delete();
});

let id = 0;

function createOpinionSummary() {
	id++;
	return {
		politician: id,
		sentiment: id,
	} as OpinionSummary;
}

describe('OpinionSummaryController (e2e)', () => {

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/opinionsummary');

		expect(response.status).toEqual(200);
	});

	it('/:id (GET)', async () => {
		const opinionSummary = createOpinionSummary();
		const insertedOpinionSummary = await service.insert(opinionSummary);

		const response = await request(app.getHttpServer())
			.get(`/opinionsummary/${insertedOpinionSummary.id}`);

		const retrievedOpinionSummary = response.body as OpinionSummary;

		expect(response.status).toEqual(200);
		expect(retrievedOpinionSummary).toEqual(insertedOpinionSummary);
	});
});

describe('OpinionSummaryService (e2e)', () => {

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Can get all', async () => {
		const opinionSummary1 = createOpinionSummary();
		const opinionSummary2 = createOpinionSummary();

		const firstInsert = await service.insert(opinionSummary1);
		const secondInsert = await service.insert(opinionSummary2);

		const opinionSummaries = await service.get({});

		expect(opinionSummaries.sort()).toEqual([firstInsert, secondInsert].sort());
	});

	it('Can get', async () => {
		const opinionSummary = createOpinionSummary();
		const insertedOpinionSummary = await service.insert(opinionSummary);
		opinionSummary.id = insertedOpinionSummary.id;

		const retrievedOpinionSummary = await service.getOne(insertedOpinionSummary.id);
		expect(retrievedOpinionSummary).toEqual(opinionSummary);
		expect(insertedOpinionSummary).toEqual(retrievedOpinionSummary);
	});

	it('Can get by politician', async () => {
		const opinionSummary = createOpinionSummary();
		const insertedOpinionSummary = await service.insert(opinionSummary);

		const politicianOpinionSummarys = await service.get({politician: insertedOpinionSummary.politician});

		for (const politician of politicianOpinionSummarys) {
			expect(politician.politician).toEqual(insertedOpinionSummary.politician);
		}
	});

	it('Can delete', async () => {
		const opinionSummary = createOpinionSummary();
		const insertedOpinionSummary = await service.insert(opinionSummary);
		await service.deleteOne(insertedOpinionSummary.id);

		const opinionSummarys: OpinionSummary[] = await service.get({id: insertedOpinionSummary.id});

		expect(opinionSummarys.length).toEqual(0);
	});

	it('Can update', async () => {
		const opinionSummary = createOpinionSummary();
		const insertedOpinionSummary = await service.insert(opinionSummary);
		insertedOpinionSummary.politician += 1;
		await service.update(insertedOpinionSummary);

		const updatedOpinionSummary = await service.getOne(insertedOpinionSummary.id);

		expect(updatedOpinionSummary).toEqual(insertedOpinionSummary);
	});
});
