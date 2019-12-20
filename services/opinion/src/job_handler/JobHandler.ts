import Job from '../entity/Job';

interface JobHandler<T extends Job> {
    handle(job: T): Promise<void>;
}

export default JobHandler;
