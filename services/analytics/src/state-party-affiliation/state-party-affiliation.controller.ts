import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';
import { StatePartyAffiliationService } from './state-party-affiliation.service';
import { CreateStatePartyAffiliation } from './dtos/create-state-party-affiliation';
import { EventPattern } from '@nestjs/microservices';

@Controller('state-party-affiliation')
export class StatePartyAffiliationController {
	constructor(private statePartyAffiliationService: StatePartyAffiliationService) {}

	@Get()
	async findAll(): Promise<StatePartyAffiliation[]> {
		return await this.statePartyAffiliationService.findAll();
	}

	@Post()
	async create(@Body() createStatePartyAffiliation: CreateStatePartyAffiliation): Promise<StatePartyAffiliation> {
		return await this.statePartyAffiliationService.create(createStatePartyAffiliation);
	}

	@EventPattern('analytics-state-party-affiliation-create')
	async handleStatePartyAffiliationCreated(@Body() createStatePartyAffiliation: CreateStatePartyAffiliation): Promise<StatePartyAffiliation> {
		return await this.statePartyAffiliationService.create(createStatePartyAffiliation);
	}
}
