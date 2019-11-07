import Event from './Event';
import EventHandler from './EventHandler';

interface EventBus {
    publish(event: Event<any>): Promise<void>;

    subscribe(eventHandler: EventHandler<Event<any>>);
}

export default EventBus;