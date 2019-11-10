import EventHandler from './EventHandler';
import EventType from './EventType';

interface EventBus {
    publish(eventType: EventType, event: any): Promise<void>;

    subscribe(eventHandler: EventHandler<EventType, any>);
}

export default EventBus;