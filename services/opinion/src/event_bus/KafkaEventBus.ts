import EventBus from './EventBus';
import Event from './Event';
import EventHandler from './EventHandler';
import { Consumer, KafkaClient, Message, Producer } from 'kafka-node';

class KafkaEventBus implements EventBus {

    private static topic = 'opinion';
    private static groupId = 'opinionGroup';
    private readonly producer: Producer;
    private readonly consumer: Consumer;
    private readonly eventHandlers: Array<EventHandler<Event<any>>>;

    constructor(eventHandlers: Array<EventHandler<Event<any>>>) {
        const client = new KafkaClient({kafkaHost: 'queue-kafka:9092'});
        this.producer = new Producer(client);
        this.consumer = new Consumer(client, [{topic: KafkaEventBus.topic}], {
            groupId: KafkaEventBus.groupId
        });

        this.consumer.on('message', this.processMessage);
    }

    async processMessage(message: Message) {
        if (typeof message.value !== 'string')
            return;

        const event: Event<any> = JSON.parse(message.value);

        for(let eventHandler of this.eventHandlers) {
            if(eventHandler.getType() === event.)
        }
    }


    async publish(event: Event<any>) {

        await this.send([
            {
                messages: event.getData(),
                topic: 'test'
            }
        ]);
    }

    subscribe(eventHandler: EventHandler<Event<any>>) {

    }

}