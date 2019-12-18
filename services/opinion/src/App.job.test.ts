import { agent } from 'supertest';
import App from './App';
import { assert } from 'chai';
import { container } from './inversify.config';
import { TYPES } from './types';
import OpinionSummaryJobRepository from './entity/repositories/OpinionSummaryJobRepository';
import OpinionSummaryJob, { JobStatus } from './entity/OpinionSummaryJob';

describe('Job API tests', () => {

    let app: App;
    let opinionSummaryJobRepository: OpinionSummaryJobRepository;

    let id = 1;

    function createJob() {
        id++;
        return <OpinionSummaryJob> {
            status: JobStatus.InProgress,
            politician: id
        }
    }

    let testJob1: OpinionSummaryJob = createJob();
    let testJob2: OpinionSummaryJob = createJob();

    before(async () => {
        app = container.get<App>(TYPES.App);
        opinionSummaryJobRepository = container.get<OpinionSummaryJobRepository>(TYPES.OpinionSummaryJobRepository);

        testJob1 = await opinionSummaryJobRepository.insert(testJob1);
        testJob2 = await opinionSummaryJobRepository.insert(testJob2);
    });

    it('Can get all Jobs', async () => {
        const res = await agent(app.app).get('/job/opinionsummary');
        const jobs: Array<OpinionSummaryJob> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(jobs, [testJob1, testJob2]);
    });

    it('Can get Job', async () => {
        const res = await agent(app.app).get(`/job/opinionsummary/${testJob1.id}`);
        const job: OpinionSummaryJob = res.body;

        assert.equal(res.status, 200);
        assert.deepEqual(job, testJob1);
    });

    it('Can insert Job', async () => {
        const newJob = createJob();

        let res = await agent(app.app).post('/job/opinionsummary').send(newJob);
        const job: OpinionSummaryJob = res.body;
        newJob.id = job.id;

        res = await agent(app.app).get(`/job/${job.id}`);
        const insertedJob: OpinionSummaryJob = res.body;

        assert.deepEqual(insertedJob, newJob);
    });
});
