import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';
import { StatePartyAffiliationService } from './state-party-affiliation.service';
import { CreateStatePartyAffiliationDto } from './dtos/create-state-party-affiliation-dto';
import { EventPattern } from '@nestjs/microservices';
import { SearchStatePartyAffiliationDto } from './dtos/search-state-party-affiliation.dto';

@Controller('state-party-affiliation')
export class StatePartyAffiliationController {
	constructor(private statePartyAffiliationService: StatePartyAffiliationService) {}

	@Get()
	async findAll(@Query() searchStatePartyAffiliationDto: SearchStatePartyAffiliationDto): Promise<StatePartyAffiliation[]> {
		return await this.statePartyAffiliationService.find(searchStatePartyAffiliationDto);
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
