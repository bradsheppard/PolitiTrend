import { agent } from 'supertest';
import App from './App';
import { container } from './inversify.config';
import { TYPES } from './types';
import OpinionSummaryJobRepository from './entity/repositories/OpinionSummaryJobRepository';
import OpinionSummaryJob from './entity/OpinionSummaryJob';
import { JobStatus } from './entity/Job';
import * as chai from 'chai';
import { assert } from 'chai';
import chaiExclude from 'chai-exclude';
chai.use(chaiExclude);

describe('Job API tests', () => {

    let app: App;
    let opinionSummaryJobRepository: OpinionSummaryJobRepository;

    let id = 1;

    function createJob() {
        id++;
        const opinionSummaryJob = new OpinionSummaryJob();
        opinionSummaryJob.status = JobStatus.InProgress;
        opinionSummaryJob.politician = id;
        opinionSummaryJob.opinionSummary = id;
        return opinionSummaryJob;
    }

    let testJob1: OpinionSummaryJob = createJob();
    let testJob2: OpinionSummaryJob = createJob();

    before(async () => {
        app = container.get<App>(TYPES.App);
        opinionSummaryJobRepository = container.get<OpinionSummaryJobRepository>(TYPES.OpinionSummaryJobRepository);

        await opinionSummaryJobRepository.delete();

        testJob1 = await opinionSummaryJobRepository.insert(testJob1);
        testJob2 = await opinionSummaryJobRepository.insert(testJob2);
    });

    it('Can get all Jobs', async () => {
        const res = await agent(app.app).get('/job/opinionsummary');
        const jobs: Array<OpinionSummaryJob> = res.body;

        assert.equal(res.status, 200);
        // @ts-ignore
        assert.deepEqualExcluding(jobs, [testJob1, testJob2], '__proto__');
    });

    it('Can get Job', async () => {
        const res = await agent(app.app).get(`/job/opinionsummary/${testJob1.id}`);
        const job: OpinionSummaryJob = res.body;

        assert.equal(res.status, 200);
        // @ts-ignore
        assert.deepEqualExcluding(job, testJob1, '__proto__');
    });

    it('Can insert Job', async () => {
        const newJob = createJob();

        let res = await agent(app.app).post('/job/opinionsummary').send(newJob);
        const insertedJob: OpinionSummaryJob = res.body;
        newJob.id = insertedJob.id;
        newJob.status = JobStatus.Completed;

        res = await agent(app.app).get(`/job/opinionsummary/${insertedJob.id}`);
        const retrievedJob: OpinionSummaryJob = res.body;

        newJob.opinionSummary = retrievedJob.opinionSummary;
        // @ts-ignore
        assert.deepEqualExcluding(retrievedJob, newJob, '__proto__');
    });
});
