import EventBus from './EventBus';
import EventHandler from './EventHandler';
import { Consumer, KafkaClient, Message, Producer } from 'kafka-node';
import { injectable, multiInject } from 'inversify';
import { TYPES } from '../types';
import EventType from './EventType';

interface Event {
    type: EventType;
    data: any;
}

@injectable()
class KafkaEventBus implements EventBus {

    private ready: boolean = false;
    private static topic = 'opinion';
    private static groupId = 'opinionGroup';
    private readonly producer: Producer;
    private readonly consumer: Consumer;
    private readonly eventHandlers: Array<EventHandler<EventType, any>>;

    constructor(@multiInject(TYPES.EventHandler) eventHandlers: Array<EventHandler<EventType, any>>) {
        const client = new KafkaClient({kafkaHost: 'queue-kafka-brokers:9092'});
        this.producer = new Producer(client);
        this.consumer = new Consumer(client, [{topic: KafkaEventBus.topic}], {
             groupId: KafkaEventBus.groupId
        });
        this.eventHandlers = eventHandlers;
        this.producer.on('ready', () => {
            this.ready = true;
            console.log('Queue consumption ready!');
        });
        this.consumer.on('message', this.processMessage.bind(this));
    }

    async processMessage(message: Message) {
        console.log(`Handling message: ${message.value}`);

        if (typeof message.value !== 'string')
            return;

        const event: Event = JSON.parse(message.value);

        for(let eventHandler of this.eventHandlers) {
            if(eventHandler.getType().toString() === event.type) {
                try {
                    await eventHandler.handle(event.data);
                }
                catch(ex) {
                    console.log(ex);
                }
            }
        }
    }

    async publish(eventType: EventType, event: any) {
        const eventPayload: Event = {
            type: eventType,
            data: event
        };

        if (!this.ready) {
            await new Promise((resolve, reject) => {
                this.producer.on('ready', () => {
                    this.producer.send([
                        {
                            messages: JSON.stringify(eventPayload),
                            topic: KafkaEventBus.topic
                        }
                    ], (err, data) => {
                        if (err) {
                            reject();
                        }
                        else {
                            console.log(data);
                            resolve();
                        }
                    });
                })
            });
        }
        else {
            await new Promise(((resolve, reject) => {
                this.producer.send([
                    {
                        messages: JSON.stringify(event),
                        topic: KafkaEventBus.topic
                    }
                ], (err, data) => {
                    if (err) {
                        reject();
                    } else {
                        console.log(data);
                        resolve();
                    }
                });
            }));
        }
    }

    subscribe(eventHandler: EventHandler<EventType, any>) {
        this.eventHandlers.push(eventHandler);
    }
}

export default KafkaEventBus;