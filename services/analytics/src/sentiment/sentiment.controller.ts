import { Body, Controller, Get, Post } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { CreateSentimentDto } from './dtos/create-sentiment.dto';
import { Sentiment } from './interfaces/sentiment.interface';
import { EventPattern } from '@nestjs/microservices';

@Controller('sentiment')
export class SentimentController {
	constructor(private sentimentService: SentimentService) {}

	@Get()
	async findAll(): Promise<Sentiment[]> {
		return await this.sentimentService.findAll();
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
