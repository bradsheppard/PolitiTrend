import EventHandler from './EventHandler';
import OpinionEvent from './OpinionEvent';
import OpinionRepository from '../entity/repositories/OpinionRepository';
import { inject } from 'inversify';
import { TYPES } from '../types';

class OpinionEventHandler implements EventHandler<OpinionEvent> {

    private readonly opinionRepository: OpinionRepository;

    constructor(@inject(TYPES.OpinionRepository) opinionRepository: OpinionRepository) {
        this.opinionRepository = opinionRepository;
    }

    async handle(event: OpinionEvent): Promise<void> {
        await this.opinionRepository.insert(event.getData());
    }

    getType(): EventType {
        return EventType.Opinion;
    }
}

export default OpinionEventHandler;