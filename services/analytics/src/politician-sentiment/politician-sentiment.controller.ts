import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PoliticianSentimentService } from './politician-sentiment.service';
import { CreatePoliticianSentimentDto } from './dtos/create-politician-sentiment.dto';
import { PoliticianSentiment } from './interfaces/politician-sentiment.interface';
import { EventPattern } from '@nestjs/microservices';
import { SearchPoliticianSentimentDto } from './dtos/search-politician-sentiment.dto';

@Controller('politician-sentiment')
export class PoliticianSentimentController {
    constructor(private sentimentService: PoliticianSentimentService) {}

    @Get()
    async findAll(@Query() searchSentimentDto: SearchPoliticianSentimentDto): Promise<PoliticianSentiment[]> {
        return await this.sentimentService.find(searchSentimentDto);
    }

    @Post()
    async create(@Body() createSentimentDto: CreatePoliticianSentimentDto): Promise<PoliticianSentiment> {
        return await this.sentimentService.create(createSentimentDto);
    }

    @EventPattern('analytics-politician-sentiment-created')
    async handleSentimentCreated(createSentimentDto: CreatePoliticianSentimentDto): Promise<PoliticianSentiment> {
        return await this.sentimentService.create(createSentimentDto);
    }
}
