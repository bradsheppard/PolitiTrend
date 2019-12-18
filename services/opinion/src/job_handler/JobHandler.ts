interface JobHandler<T> {
    handle(job: T): Promise<void>;
}

export default JobHandler;
