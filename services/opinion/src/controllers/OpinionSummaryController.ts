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

    constructor(@inject(TYPES.OpinionRepository) opinionSummaryRepository: OpinionSummaryRepository) {
        this.opinionSummaryRepository = opinionSummaryRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/summary', this.getAll.bind(this));
        this.router.get('/summary/:id', this.getOne.bind(this));
    }

    private async getAll(req: Request, res: Response) {
        const summaries: Array<OpinionSummary> = await this.opinionSummaryRepository.get(req.query);
        res.json(summaries);
    }

    private getOne(req: Request, res: Response) {

    }

}

export default OpinionSummaryController;
