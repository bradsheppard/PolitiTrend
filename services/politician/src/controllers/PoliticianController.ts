import * as express from 'express';
import { Request, Response } from 'express';
import PoliticianRepository from '../entity/repositories/PoliticianRepository';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import Controller from './Controller';
import Politician from '../entity/Politician';

@injectable()
class PoliticianController implements Controller {

    public router = express.Router();
    private readonly PoliticianRepository: PoliticianRepository;

    constructor(@inject(TYPES.PoliticianRepository) PoliticianRepository: PoliticianRepository) {
        this.PoliticianRepository = PoliticianRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/ping', PoliticianController.ping.bind(this));
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', this.insert.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    private static async ping(req: Request, res: Response) {
        res.sendStatus(200);
    }

    private async getAll(req: Request, res: Response) {
        const Politicians = await this.PoliticianRepository.get({});
        res.json(Politicians);
    }

    private async getOne(req: Request, res: Response) {
        const Politician: Politician | null = await this.PoliticianRepository.getOne(parseInt(req.params.id));

        if (Politician)
            res.json(Politician);
        else
            res.sendStatus(404);
    }

    private async insert(req: Request, res: Response) {
        let Politician: Politician = req.body;
        Politician = await this.PoliticianRepository.insert(Politician);
        res.json(Politician);
    }

    private async delete(req: Request, res: Response) {
        const successful = await this.PoliticianRepository.deleteOne(parseInt(req.params.id));

        if(successful)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    }
}

export default PoliticianController;