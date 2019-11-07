import Event from './Event';
import Opinion from '../entity/Opinion';

class OpinionEvent implements Event<Opinion> {

    private readonly opinion: Opinion;

    constructor(opinion: Opinion) {
        this.opinion = opinion;
    }

    getData(): Opinion {
        return this.opinion;
    }

    getType(): EventType {
        return EventType.Opinion;
    }

}

export default OpinionEvent;