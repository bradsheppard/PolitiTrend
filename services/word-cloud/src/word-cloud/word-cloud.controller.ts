import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchWordCloudDto } from './dto/search-word-cloud.dto';
import { WordCloudService } from './word-cloud.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateWordCloudDto } from './dto/create-word-cloud.dto';
import { WordCloud } from './interfaces/word-cloud.interface';

@Controller()
export class WordCloudController {

	constructor(private wordCloudService: WordCloudService) {}

	@Get('health')
	async health(): Promise<string> {
		return 'Okay';
	}

	@Get()
	async findAll(@Query() searchWordCloudDto: SearchWordCloudDto): Promise<WordCloud[]> {
		return await this.wordCloudService.find(searchWordCloudDto);
	}

	@Post()
	async create(@Body() createWordCloudDto: CreateWordCloudDto): Promise<WordCloud> {
		return await this.wordCloudService.create(createWordCloudDto);
	}

	@EventPattern('word-cloud-created')
	async handleWordCloudCreated(createWordCloudDto: CreateWordCloudDto) {
		await this.wordCloudService.create(createWordCloudDto);
	}
}
