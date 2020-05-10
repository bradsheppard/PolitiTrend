import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchPoliticianWordCloudDto } from './dtos/search-politician-word-cloud.dto';
import { PoliticianWordCloudService } from './politician-word-cloud.service';
import { EventPattern } from '@nestjs/microservices';
import { CreatePoliticianWordCloudDto } from './dtos/create-politician-word-cloud.dto';
import { PoliticianWordCloud } from './interfaces/politician-word-cloud.interface';

@Controller('politician-word-cloud')
export class PoliticianWordCloudController {

	constructor(private politicianWordCloudService: PoliticianWordCloudService) {}

	@Get('health')
	async health(): Promise<string> {
		return 'Okay';
	}

	@Get()
	async findAll(@Query() searchPoliticianWordCloudDto: SearchPoliticianWordCloudDto): Promise<PoliticianWordCloud[]> {
		return await this.politicianWordCloudService.find(searchPoliticianWordCloudDto);
	}

	@Post()
	async create(@Body() createPoliticianWordCloudDto: CreatePoliticianWordCloudDto): Promise<PoliticianWordCloud> {
		return await this.politicianWordCloudService.create(createPoliticianWordCloudDto);
	}

	@EventPattern('analytics-politician-word-cloud-created')
	async handleWordCloudCreated(createPoliticianWordCloudDto: CreatePoliticianWordCloudDto) {
		await this.politicianWordCloudService.create(createPoliticianWordCloudDto);
	}
}
