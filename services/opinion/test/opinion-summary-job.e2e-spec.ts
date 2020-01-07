import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OpinionSummaryJobService } from '../src/opinion-summary-job/opinion-summary-job.service';
import OpinionSummaryJob, { JobStatus } from '../src/opinion-summary-job/opinion-summary-job.entity';
import { OpinionService } from '../src/opinion/opinion.service';
import Opinion from '../src/opinion/opinion.entity';

let app: INestApplication;
let opinionSummaryJobService: OpinionSummaryJobService;
let opinionService: OpinionService;

beforeAll(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();

	opinionSummaryJobService = moduleFixture.get<OpinionSummaryJobService>(OpinionSummaryJobService);
	opinionService = moduleFixture.get<OpinionService>(OpinionService);

	await app.init();
});

afterAll(async () => {
	await app.close();
});

beforeEach(async () => {
	await opinionService.delete();
	await opinionSummaryJobService.delete();
});

let id = 0;

function createOpinionSummaryJob() {
	id++;
	return {
		status: JobStatus.InProgress,
		politician: id,
		opinionSummary: id,
	} as OpinionSummaryJob;
}

function createOpinion() {
	id++;
	return {
		politician: id,
		sentiment: id,
		tweetId: id.toString(),
		tweetText: id.toString(),
	} as Opinion;
}

describe('OpinionSummaryJobController (e2e)', () => {

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/job/opinionsummary');

		expect(response.status).toEqual(200);
	});

	it('/:id (GET)', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertedOpinionSummaryJob = await opinionSummaryJobService.insert(opinionSummaryJob);

		const response = await request(app.getHttpServer())
			.get(`/job/opinionsummary/${insertedOpinionSummaryJob.id}`);

		const retrievedOpinionSummaryJob = response.body as OpinionSummaryJob;

		expect(response.status).toEqual(200);
		expect(retrievedOpinionSummaryJob).toEqual(insertedOpinionSummaryJob);
	});

	it('/ (POST), opinions exist for politician', async () => {
		const opinion = createOpinion();
		await opinionService.insert(opinion);

		const opinionSummaryJob = createOpinionSummaryJob();
		opinionSummaryJob.politician = opinion.politician;

		const response = await request(app.getHttpServer())
			.post('/job/opinionsummary')
			.send(opinionSummaryJob);

		const insertedOpinionSummaryJob = response.body as OpinionSummaryJob;

		expect(response.status).toEqual(201);
		expect(insertedOpinionSummaryJob.status).toBe(JobStatus.Completed);
		expect(insertedOpinionSummaryJob.opinionSummary).not.toBeNaN();
	});

	it('/ (POST), opinions don\'t exist for politician', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();

		const response = await request(app.getHttpServer())
			.post('/job/opinionsummary')
			.send(opinionSummaryJob);

		const insertedOpinionSummaryJob = response.body as OpinionSummaryJob;

		expect(response.status).toEqual(201);
		expect(insertedOpinionSummaryJob.status).toBe(JobStatus.Error);
	});
});

describe('OpinionSummaryJobService (e2e)', () => {

	it('should be defined', () => {
		expect(opinionSummaryJobService).toBeDefined();
	});

	it('Can get all', async () => {
		const opinionSummaryJob1 = createOpinionSummaryJob();
		const opinionSummaryJob2 = createOpinionSummaryJob();

		const firstInsert = await opinionSummaryJobService.insert(opinionSummaryJob1);
		const secondInsert = await opinionSummaryJobService.insert(opinionSummaryJob2);

		const opinionSummaries = await opinionSummaryJobService.get({});

		expect(opinionSummaries.sort()).toEqual([firstInsert, secondInsert].sort());
	});

	it('Can get', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertedOpinionSummaryJob = await opinionSummaryJobService.insert(opinionSummaryJob);
		opinionSummaryJob.id = insertedOpinionSummaryJob.id;

		const retrievedOpinionSummaryJob = await opinionSummaryJobService.getOne(insertedOpinionSummaryJob.id);
		expect(retrievedOpinionSummaryJob).toEqual(opinionSummaryJob);
		expect(insertedOpinionSummaryJob).toEqual(retrievedOpinionSummaryJob);
	});

	it('Can get by politician', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertedOpinionSummaryJob = await opinionSummaryJobService.insert(opinionSummaryJob);

		const politicianOpinionSummaryJobs = await opinionSummaryJobService.get({politician: insertedOpinionSummaryJob.politician});

		for (const politician of politicianOpinionSummaryJobs) {
			expect(politician.politician).toEqual(insertedOpinionSummaryJob.politician);
		}
	});

	it('Can delete', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertedOpinionSummaryJob = await opinionSummaryJobService.insert(opinionSummaryJob);
		await opinionSummaryJobService.deleteOne(insertedOpinionSummaryJob.id);

		const opinionSummaryJobs: OpinionSummaryJob[] = await opinionSummaryJobService.get({id: insertedOpinionSummaryJob.id});

		expect(opinionSummaryJobs.length).toEqual(0);
	});

	it('Can update', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertedOpinionSummaryJob = await opinionSummaryJobService.insert(opinionSummaryJob);
		insertedOpinionSummaryJob.politician += 1;
		await opinionSummaryJobService.update(insertedOpinionSummaryJob);

		const updatedOpinionSummaryJob = await opinionSummaryJobService.getOne(insertedOpinionSummaryJob.id);

		expect(updatedOpinionSummaryJob).toEqual(insertedOpinionSummaryJob);
	});

	it('Can insert', async () => {
		const opinionSummaryJob = createOpinionSummaryJob();
		const insertedOpinionSummaryJob = await opinionSummaryJobService.insert(opinionSummaryJob);

		expect(insertedOpinionSummaryJob.status).toEqual(JobStatus.InProgress);
		expect(insertedOpinionSummaryJob.politician).toEqual(opinionSummaryJob.politician);
	});
});
