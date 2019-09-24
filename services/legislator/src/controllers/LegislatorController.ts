import * as express from 'express';
import { Request, Response } from 'express';
import LegislatorRepository from '../entity/repositories/LegislatorRepository';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import Controller from './Controller';

@injectable()
class LegislatorController implements Controller {

    public router = express.Router();
    private readonly legislatorRepository: LegislatorRepository;

    constructor(@inject(TYPES.LegislatorRepository) legislatorRepository: LegislatorRepository) {
        this.legislatorRepository = legislatorRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', this.insert.bind(this));
    }

    private async getAll(req: Request, res: Response) {
        const legislators = await this.legislatorRepository.get({});
        res.json(legislators);
    }

    private async getOne(req: Request, res: Response) {
        const legislator = await this.legislatorRepository.getOne(parseInt(req.params.id));
        res.json(legislator);
    }

    private async insert(req: Request, res: Response) {
    
    }
}

export default LegislatorController;