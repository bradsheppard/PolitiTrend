import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaDeserializer } from './kafka.deserializer';

const microserviceConfig: MicroserviceOptions = {
	transport: Transport.KAFKA,
	options: {
		client: {
			brokers: ['queue-kafka:9092'],
		},
		deserializer: new KafkaDeserializer(),
	},
};

export default microserviceConfig;
