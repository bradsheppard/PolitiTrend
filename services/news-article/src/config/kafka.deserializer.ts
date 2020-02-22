import { ConsumerDeserializer, IncomingEvent, IncomingRequest } from '@nestjs/microservices';

export class KafkaDeserializer implements ConsumerDeserializer {
	deserialize(value: any, options?: Record<string, any>): (IncomingRequest | IncomingEvent) {
		return {
			data: value.value,
			pattern: options.channel,
		} as IncomingEvent;
	}
}
