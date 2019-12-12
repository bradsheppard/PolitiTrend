import * as express from 'express';
import Controller from './Controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import JobRepository from '../entity/repositories/JobRepository';

@injectable()
class JobController implements Controller {
    
    public router: express.Router;
    private readonly jobRepository: JobRepository;

    constructor(@inject(TYPES.JobRepository) JobRepository: JobRepository) {
        this.jobRepository = JobRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }
}

export default JobController;