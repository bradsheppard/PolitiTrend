import { agent } from 'supertest';
import App from './App';
import Job, { JobStatus, JobType } from './entity/Job';
import { assert } from 'chai';
import { container } from './inversify.config';
import { TYPES } from './types';
import JobRepository from './entity/repositories/JobRepository';

describe('Job API tests', () => {

    let app: App;
    let jobRepository: JobRepository;

    function createJob() {
        return <Job> {
            status: JobStatus.InProgress,
            type: JobType.OpinionSummary,
        }
    }

    const testJob1: Job = createJob();
    const testJob2: Job = createJob();

    before(async () => {
        app = container.get<App>(TYPES.App);
        jobRepository = container.get<JobRepository>(TYPES.JobRepository);
    });

    it('Can get all Jobs', async () => {
        const res = await agent(app.app).get('/');
        const jobs: Array<Job> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(jobs, [testJob1, testJob2]);
    });

    it('Can get Job', async () => {
        const res = await agent(app.app).get('/');
        const jobs: Array<Job> = res.body;

        assert.equal(res.status, 200);
        assert.includeDeepMembers(jobs, [testJob1, testJob2]);
    });

    it('Can insert Job', async () => {
        const newJob = createJob();

        let res = await agent(app.app).post('/').send(newJob);
        const job: Job = res.body;
        newJob.id = job.id;

        res = await agent(app.app).get(`/${job.id}`);
        const insertedJob: Job = res.body;

        assert.deepEqual(insertedJob, newJob);
    });
});