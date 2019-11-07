import Event from './Event';

interface EventHandler {
    handle(event: Event<any>): Promise<void>;
    getType(): EventType;
}

export default EventHandler;