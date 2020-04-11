import { Injectable } from '@nestjs/common';
import { TerminusEndpoint, TerminusModuleOptions, TerminusOptionsFactory, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {

	constructor(
		private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
	) {}

	createTerminusOptions(): TerminusModuleOptions {
		const healthEndpoint: TerminusEndpoint = {
			url: '/health',
			healthIndicators: [
				async () => this.typeOrmHealthIndicator.pingCheck('database'),
			],
		};
		return {
			endpoints: [healthEndpoint],
		};
	}
}
