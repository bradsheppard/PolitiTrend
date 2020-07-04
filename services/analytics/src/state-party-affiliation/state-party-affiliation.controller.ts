import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';
import { StatePartyAffiliationService } from './state-party-affiliation.service';
import { CreateStatePartyAffiliationDto } from './dtos/create-state-party-affiliation-dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('state-party-affiliation')
export class StatePartyAffiliationController {
	constructor(private statePartyAffiliationService: StatePartyAffiliationService) {}

	@Get()
	async findAll(): Promise<StatePartyAffiliation[]> {
		return await this.statePartyAffiliationService.findAll();
	}

	@Post()
	async create(@Body() createStatePartyAffiliation: CreateStatePartyAffiliationDto): Promise<StatePartyAffiliation> {
		return await this.statePartyAffiliationService.create(createStatePartyAffiliation);
	}

	@EventPattern('analytics-state-party-affiliation-created')
	async handleStatePartyAffiliationCreated(@Body() createStatePartyAffiliation: CreateStatePartyAffiliationDto): Promise<StatePartyAffiliation> {
		return await this.statePartyAffiliationService.create(createStatePartyAffiliation);
	}
}
