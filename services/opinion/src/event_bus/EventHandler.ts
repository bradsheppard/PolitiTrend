import EventType from './EventType';

interface EventHandler<T extends EventType, E> {
    handle(event: E): Promise<void>;

    getType(): T;
}

export default EventHandler;