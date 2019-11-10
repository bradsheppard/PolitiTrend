import 'reflect-metadata';
import EventBus from './EventBus';
import Opinion from '../entity/Opinion';
import EventType from './EventType';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';
import KafkaEventBus from './KafkaEventBus';
import EventHandler from './EventHandler';

describe('Event bus tests', () => {

    let eventBus: EventBus;
    let eventHandler: EventHandler<EventType.NewOpinion, Opinion>;

    before(async () => {
        eventHandler = mock<EventHandler<EventType.NewOpinion, Opinion>>();
        when(eventHandler.getType()).thenReturn(EventType.NewOpinion);
        const stubEventHandler = instance(eventHandler);

        eventBus = new KafkaEventBus([stubEventHandler]);
    });

    it('Can send/receive message', async () => {
        const opinion: Opinion = {
            id: 1,
            politician: 12,
            sentiment: 123,
            tweet: 1234
        };

        await eventBus.publish(EventType.NewOpinion, opinion);
        await delay(2000);
        verify(eventHandler.handle(deepEqual(opinion))).once();
    });

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
});