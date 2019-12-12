import { assert } from 'chai';
import Job, { JobStatus, JobType } from '../../entity/Job';
import JobRepository from './JobRepository';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';

describe('Job repository tests', () => {

    let jobRepository: JobRepository;

    function createInProgress() {
        return <Job> {
            status: JobStatus.InProgress,
            type: JobType.OpinionSummary
        };
    }

    function createCompletedJob() {
        return <Job> {
            status: JobStatus.Completed,
            type: JobType.OpinionSummary
        }
    }

    before(async () => {
        jobRepository = container.get<JobRepository>(TYPES.JobRepository);
        await jobRepository.delete();
    });

    it('Can get all', async () => {
        const job1 = createInProgress();
        const job2 = createInProgress();

        const firstInsert = await jobRepository.insert(job1);
        const secondInsert = await jobRepository.insert(job2);

        const Jobs = await jobRepository.get({});

        assert.includeDeepMembers(Jobs, [firstInsert, secondInsert]);
    });

    it('Can get', async() => {
        const job = createInProgress();
        const insertedJob = await jobRepository.insert(job);

        const retrievedJob = await jobRepository.getOne(insertedJob.id);
        assert.deepEqual(retrievedJob, job);
    });

    it('Can get by job status', async() => {
        const inProgressJob1 = createInProgress();
        const inProgressJob2 = createInProgress();

        const completedJob = createCompletedJob();

        await jobRepository.insert(inProgressJob1);
        await jobRepository.insert(inProgressJob2);
        await jobRepository.insert(completedJob);

        const completedJobs = await jobRepository.get({status: JobStatus.Completed});

        for(let completedJob of completedJobs) {
            assert.equal(completedJob.status, JobStatus.Completed);
        }
    });

    it('Can delete', async () => {
        const job = createInProgress();
        const insertedJob = await jobRepository.insert(job);
        await jobRepository.deleteOne(insertedJob.id);

        const jobs: Array<Job> = await jobRepository.get({id: insertedJob.id});

        assert.isEmpty(jobs);
    });

    it('Can update', async () => {
        const job = createInProgress();
        const insertedJob = await jobRepository.insert(job);
        insertedJob.status = JobStatus.Completed;
        await jobRepository.update(job);

        const updatedJob = await jobRepository.getOne(insertedJob.id);

        assert.deepEqual(updatedJob, insertedJob);
    });
});