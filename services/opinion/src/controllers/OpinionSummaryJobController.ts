import * as express from 'express';
import { Request, Response } from 'express';
import Controller from './Controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import JobRepository from '../entity/repositories/JobRepository';
import Job, { JobStatus } from '../entity/Job';
import JobHandler from '../job_handler/JobHandler';
import OpinionSummaryJob from '../entity/OpinionSummaryJob';

@injectable()
class OpinionSummaryJobController implements Controller {
    
    public router = express.Router();
    private readonly jobRepository: JobRepository;
    private readonly opinionSummaryJobHandler: JobHandler<OpinionSummaryJob>;

    constructor(@inject(TYPES.JobRepository) JobRepository: JobRepository) {
        this.jobRepository = JobRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/job/opinionsummary', this.getAll.bind(this));
        this.router.get('/job/opinionsummary/:id', this.getOne.bind(this));
        this.router.post('/job/opinionsummary', this.insert.bind(this));
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
        let job: OpinionSummaryJob = req.body;
        await this.jobRepository.insert(job);

        job.status = JobStatus.InProgress;

        await this.opinionSummaryJobHandler.handle(job);

        res.json(job);
    }
}

export default OpinionSummaryJobController;
