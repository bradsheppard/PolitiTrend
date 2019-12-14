import Controller from './Controller';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import OpinionSummaryRepository from '../entity/repositories/OpinionSummaryRepository';

@injectable()
class OpinionSummaryController implements Controller {

    public router = express.Router();
    private readonly opinionSummaryRepository: OpinionSummaryRepository;

    constructor(@inject(TYPES.OpinionRepository) opinionSummaryRepository: OpinionSummaryRepository) {
        this.opinionSummaryRepository = opinionSummaryRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {}

}

export default OpinionSummaryController;
