import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaDeserializer } from './kafka.deserializer';

const microserviceConfig: MicroserviceOptions = {
	transport: Transport.KAFKA,
	options: {
		client: {
			brokers: ['queue-kafka-bootstrap:9092'],
		},
		consumer: {
			groupId: 'tweet-consumer'
		},
		deserializer: new KafkaDeserializer(),
	},
};

export default microserviceConfig;
