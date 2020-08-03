import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { CreateSentimentDto } from './dtos/create-sentiment.dto';
import { Sentiment } from './interfaces/sentiment.interface';
import { EventPattern } from '@nestjs/microservices';
import { SearchSentimentDto } from './dtos/search-sentiment.dto';

@Controller('sentiment')
export class SentimentController {
	constructor(private sentimentService: SentimentService) {}

	@Get()
	async findAll(@Query() searchSentimentDto: SearchSentimentDto): Promise<Sentiment[]> {
		if(searchSentimentDto.politician)
			return await this.sentimentService.findByPolitician(searchSentimentDto.politician);

		return await this.sentimentService.findAll(searchSentimentDto);
	}

	@Post()
	async create(@Body() createSentimentDto: CreateSentimentDto): Promise<Sentiment> {
		return await this.sentimentService.create(createSentimentDto);
	}

	@EventPattern('analytics-sentiment-created')
	async handleSentimentCreated(createSentimentDto: CreateSentimentDto): Promise<Sentiment> {
		return await this.sentimentService.create(createSentimentDto);
	}
}
