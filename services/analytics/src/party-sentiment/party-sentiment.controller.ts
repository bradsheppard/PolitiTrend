import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PartySentimentService } from './party-sentiment.service';
import { CreatePartySentimentDto } from './dtos/create-party-sentiment.dto';
import { PartySentiment } from './interfaces/party-sentiment.interface';
import { EventPattern } from '@nestjs/microservices';
import { SearchPartySentimentDto } from './dtos/search-party-sentiment.dto';

@Controller('party-sentiment')
export class PartySentimentController {
	constructor(private sentimentService: PartySentimentService) {}

	@Get()
	async findAll(@Query() searchSentimentDto: SearchPartySentimentDto): Promise<PartySentiment[]> {
		return await this.sentimentService.find(searchSentimentDto);
	}

	@Post()
	async create(@Body() createSentimentDto: CreatePartySentimentDto): Promise<PartySentiment> {
		return await this.sentimentService.create(createSentimentDto);
	}

	@EventPattern('analytics-party-sentiment-created')
	async handleSentimentCreated(createSentimentDto: CreatePartySentimentDto): Promise<PartySentiment> {
		return await this.sentimentService.create(createSentimentDto);
	}
}
