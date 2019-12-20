import OpinionSummaryJob from '../../entity/OpinionSummaryJob';
import OpinionSummaryJobRepository from './OpinionSummaryJobRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';
import { JobStatus } from '../Job';
import { assert } from 'chai';

describe('OpinionSummaryJob repository tests', () => {

    let opinionSummaryJobRepository: OpinionSummaryJobRepository;

    let id = 1;

    function createInProgress(): OpinionSummaryJob {
        id++;

        const opinionSummaryJob = new OpinionSummaryJob();
        opinionSummaryJob.status = JobStatus.InProgress;
        opinionSummaryJob.politician = id;
        opinionSummaryJob.opinionSummary = id;

        return opinionSummaryJob;
    }

    function createCompletedOpinionSummaryJob(): OpinionSummaryJob {
        id++;

        const opinionSummaryJob = new OpinionSummaryJob();
        opinionSummaryJob.status = JobStatus.Completed;
        opinionSummaryJob.politician = id;
        opinionSummaryJob.opinionSummary = id;

        return opinionSummaryJob;
    }

    before(async () => {
        opinionSummaryJobRepository = container.get<OpinionSummaryJobRepository>(TYPES.OpinionSummaryJobRepository);
        await opinionSummaryJobRepository.delete();
    });

    it('Can get all', async () => {
        const job1: OpinionSummaryJob = createInProgress();
        const job2: OpinionSummaryJob = createInProgress();

        const firstInsert = await opinionSummaryJobRepository.insert(job1);
        const secondInsert = await opinionSummaryJobRepository.insert(job2);

        const opinionSummaryJobs = await opinionSummaryJobRepository.get({});

        assert.deepEqual(opinionSummaryJobs, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const job: OpinionSummaryJob = createInProgress();
        const insertedOpinionSummaryJob = await opinionSummaryJobRepository.insert(job);
        job.id = insertedOpinionSummaryJob.id;

        const retrievedOpinionSummaryJob = await opinionSummaryJobRepository.getOne(insertedOpinionSummaryJob.id);
        assert.deepEqual(retrievedOpinionSummaryJob, job);
        assert.deepEqual(insertedOpinionSummaryJob, retrievedOpinionSummaryJob);
    });

    it('Can get by job status', async() => {
        const inProgressOpinionSummaryJob1 = createInProgress();
        const inProgressOpinionSummaryJob2 = createInProgress();

        const completedOpinionSummaryJob = createCompletedOpinionSummaryJob();

        await opinionSummaryJobRepository.insert(inProgressOpinionSummaryJob1);
        await opinionSummaryJobRepository.insert(inProgressOpinionSummaryJob2);
        await opinionSummaryJobRepository.insert(completedOpinionSummaryJob);

        const completedOpinionSummaryJobs = await opinionSummaryJobRepository.get({status: JobStatus.Completed});

        for(let completedOpinionSummaryJob of completedOpinionSummaryJobs) {
            assert.equal(completedOpinionSummaryJob.status, JobStatus.Completed);
        }
    });

    it('Can delete', async () => {
        const job = createInProgress();
        const insertedOpinionSummaryJob = await opinionSummaryJobRepository.insert(job);
        await opinionSummaryJobRepository.deleteOne(insertedOpinionSummaryJob.id);

        const jobs: Array<OpinionSummaryJob> = await opinionSummaryJobRepository.get({id: insertedOpinionSummaryJob.id});

        assert.equal(jobs.length, 0);
    });

    it('Can update', async () => {
        const job = createInProgress();
        const insertedOpinionSummaryJob = await opinionSummaryJobRepository.insert(job);
        insertedOpinionSummaryJob.status = JobStatus.Completed;
        await opinionSummaryJobRepository.update(insertedOpinionSummaryJob);

        const updatedOpinionSummaryJob = await opinionSummaryJobRepository.getOne(insertedOpinionSummaryJob.id);

        assert.deepEqual(updatedOpinionSummaryJob, insertedOpinionSummaryJob);
    });
});
