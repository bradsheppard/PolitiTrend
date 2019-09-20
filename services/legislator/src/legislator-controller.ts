import express, { Request, Response } from 'express';
import LegislatorRepository from './entity/repositories/LegislatorRepository';
import { TYPES } from './types';
import { inject, injectable } from 'inversify';

@injectable()
class LegislatorController {

    private readonly router = express.Router();
    private readonly legislatorRepository: LegislatorRepository;

    constructor(@inject(TYPES.LegislatorRepository) legislatorRepository: LegislatorRepository) {
        this.legislatorRepository = legislatorRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getAll)
    }

    private async getAll(req: Request, res: Response) {
        const legislators = await this.legislatorRepository.get({});
        res.json(legislators);
    }
}