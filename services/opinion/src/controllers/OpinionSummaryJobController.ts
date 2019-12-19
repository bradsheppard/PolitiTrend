import * as express from 'express';
import { Request, Response } from 'express';
import Controller from './Controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import OpinionSummaryJobRepository from '../entity/repositories/OpinionSummaryJobRepository';
import JobHandler from '../job_handler/JobHandler';
import OpinionSummaryJob, { JobStatus } from '../entity/OpinionSummaryJob';
import OpinionSummaryJobHandler from '../job_handler/OpinionSummaryJobHandler';

@injectable()
class OpinionSummaryJobController implements Controller {
    
    public router = express.Router();
    private readonly opinionSummaryJobRepository: OpinionSummaryJobRepository;
    private readonly opinionSummaryJobHandler: JobHandler<OpinionSummaryJob>;

    constructor(
        @inject(TYPES.OpinionSummaryJobRepository) summaryJobRepository: OpinionSummaryJobRepository,
        @inject(TYPES.OpinionSummaryJobHandler) opinionSummaryJobHandler: OpinionSummaryJobHandler)
    {
        this.opinionSummaryJobRepository = summaryJobRepository;
        this.opinionSummaryJobHandler = opinionSummaryJobHandler;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/job/opinionsummary', this.getAll.bind(this));
        this.router.get('/job/opinionsummary/:id', this.getOne.bind(this));
        this.router.post('/job/opinionsummary', this.insert.bind(this));
    }

    private async getAll(req: Request, res: Response) {
        const opinions = await this.opinionSummaryJobRepository.get(req.query);
        res.json(opinions);
    }

    private async getOne(req: Request, res: Response) {
        const job: OpinionSummaryJob | null = await this.opinionSummaryJobRepository.getOne(parseInt(req.params.id));

        if (job)
            res.json(job);
        else
            res.sendStatus(404);
    }

    private async insert(req: Request, res: Response) {
        let job: OpinionSummaryJob = req.body;
        await this.opinionSummaryJobRepository.insert(job);

        job.status = JobStatus.InProgress;

        await this.opinionSummaryJobHandler.handle(job);

        res.json(job);
    }
}

export default OpinionSummaryJobController;
