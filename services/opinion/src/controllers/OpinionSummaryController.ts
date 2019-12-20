import Controller from './Controller';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import OpinionSummaryRepository from '../entity/repositories/OpinionSummaryRepository';
import { Request, Response } from 'express';
import OpinionSummary from '../entity/OpinionSummary';

@injectable()
class OpinionSummaryController implements Controller {

    public router = express.Router();
    private readonly opinionSummaryRepository: OpinionSummaryRepository;

    constructor(@inject(TYPES.OpinionSummaryRepository) opinionSummaryRepository: OpinionSummaryRepository) {
        this.opinionSummaryRepository = opinionSummaryRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/opinionsummary', this.getAll.bind(this));
        this.router.get('/opinionsummary/:id', this.getOne.bind(this));
    }

    private async getAll(req: Request, res: Response) {
        const summaries: Array<OpinionSummary> = await this.opinionSummaryRepository.get(req.query);
        res.json(summaries);
    }

    private async getOne(req: Request, res: Response) {
        const summary: OpinionSummary | null = await this.opinionSummaryRepository.getOne(parseInt(req.params.id));

        if(summary)
            res.json(summary);
        else
            res.sendStatus(404);
    }

}

export default OpinionSummaryController;
