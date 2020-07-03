import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStatePartyAffiliation {
	@IsString()
	state: string;

	affiliations: Affiliations;
}

export class Affiliations {
	@IsInt()
	@Type(() => Number)
	democratic: number;

	@IsInt()
	@Type(() => Number)
	republican: number;
}
