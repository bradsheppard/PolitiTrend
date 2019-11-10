import EventHandler from './EventHandler';
import OpinionRepository from '../entity/repositories/OpinionRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import EventType from './EventType';
import Opinion from '../entity/Opinion';

@injectable()
class NewOpinionEventHandler implements EventHandler<EventType.NewOpinion, Opinion> {

    private readonly opinionRepository: OpinionRepository;

    constructor(@inject(TYPES.OpinionRepository) opinionRepository: OpinionRepository) {
        this.opinionRepository = opinionRepository;
    }

    async handle(event: Opinion): Promise<void> {
        await this.opinionRepository.insert(event);
    }

    getType(): EventType.NewOpinion {
        return EventType.NewOpinion
    }
}

export default NewOpinionEventHandler;