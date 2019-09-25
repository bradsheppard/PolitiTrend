import * as express from 'express';
import { Request, Response } from 'express';
import LegislatorRepository from '../entity/repositories/LegislatorRepository';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import Controller from './Controller';
import Legislator from '../entity/Legislator';

@injectable()
class LegislatorController implements Controller {

    public router = express.Router();
    private readonly legislatorRepository: LegislatorRepository;

    constructor(@inject(TYPES.LegislatorRepository) legislatorRepository: LegislatorRepository) {
        this.legislatorRepository = legislatorRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/ping', LegislatorController.ping.bind(this));
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', this.insert.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    private static async ping(req: Request, res: Response) {
        res.sendStatus(200);
    }

    private async getAll(req: Request, res: Response) {
        const legislators = await this.legislatorRepository.get({});
        res.json(legislators);
    }

    private async getOne(req: Request, res: Response) {
        const legislator: Legislator | null = await this.legislatorRepository.getOne(parseInt(req.params.id));

        if (legislator)
            res.json(legislator);
        else
            res.sendStatus(404);
    }

    private async insert(req: Request, res: Response) {
        let legislator: Legislator = req.body;
        legislator = await this.legislatorRepository.insert(legislator);
        res.json(legislator);
    }

    private async delete(req: Request, res: Response) {
        const successful = await this.legislatorRepository.delete(parseInt(req.params.id));

        if(successful)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    }
}

export default LegislatorController;