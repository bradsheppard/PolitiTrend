import * as express from 'express';
import { Request, Response } from 'express';
import OpinionRepository from '../entity/repositories/OpinionRepository';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import Controller from './Controller';
import Opinion from '../entity/Opinion';

@injectable()
class OpinionController implements Controller {

    public router = express.Router();
    private readonly opinionRepository: OpinionRepository;

    constructor(@inject(TYPES.OpinionRepository) OpinionRepository: OpinionRepository) {
        this.opinionRepository = OpinionRepository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/ping', OpinionController.ping.bind(this));
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', this.insert.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }

    private static async ping(req: Request, res: Response) {
        res.sendStatus(200);
    }

    private async getAll(req: Request, res: Response) {
        const opinions = await this.opinionRepository.get(req.query);
        res.json(opinions);
    }

    private async getOne(req: Request, res: Response) {
        const opinion: Opinion | null = await this.opinionRepository.getOne(parseInt(req.params.id));

        if (opinion)
            res.json(opinion);
        else
            res.sendStatus(404);
    }

    private async insert(req: Request, res: Response) {
        let opinion: Opinion = req.body;
        opinion = await this.opinionRepository.insert(opinion);
        res.json(opinion);
    }

    private async delete(req: Request, res: Response) {
        const successful = await this.opinionRepository.deleteOne(parseInt(req.params.id));

        if(successful)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    }
}

export default OpinionController;