import * as express from 'express';
import Controller from './Controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import JobRepository from '../entity/repositories/JobRepository';
import { Request } from 'express';
import { Response } from 'express';
import Job from '../entity/Job';

@injectable()
class JobController implements Controller {
    
    public router = express.Router();
    private readonly jobRepository: JobRepository;

    constructor(@inject(TYPES.JobRepository) JobRepository: JobRepository) {
        this.jobRepository = JobRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/job', this.getAll.bind(this));
        this.router.get('/job/:id', this.getOne.bind(this));
        this.router.post('/job', this.insert.bind(this));
    }

    private async getAll(req: Request, res: Response) {
        const opinions = await this.jobRepository.get(req.query);
        res.json(opinions);
    }

    private async getOne(req: Request, res: Response) {
        const job: Job | null = await this.jobRepository.getOne(parseInt(req.params.id));

        if (job)
            res.json(job);
        else
            res.sendStatus(404);
    }

    private async insert(req: Request, res: Response) {
        let job: Job = req.body;
        job = await this.jobRepository.insert(job);
        res.json(job);
    }
}

export default JobController;
