import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { EventPattern } from '@nestjs/microservices';
import Tweet from './tweet.entity';
import { SearchTweetDto } from './dto/search-tweet.dto';

@Controller('tweet')
export class TweetController {
	constructor(private opinionService: TweetService) {}

	@Get()
	async findAll(@Query() query: SearchTweetDto) {
		return await this.opinionService.get(query);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const opinion = await this.opinionService.getOne(parseInt(id, 10));

		if (!opinion) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return opinion;
	}

	@Post()
	async create(@Body() createOpinionDto: CreateTweetDto): Promise<Tweet> {
		return await this.opinionService.insert(createOpinionDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const successful = await this.opinionService.deleteOne(parseInt(id, 10));

		if (!successful) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
	}

	@EventPattern('tweet_created')
	async handleTweetCreated(createOpinionDto: CreateTweetDto) {
		await this.opinionService.upsertOnTweetId(createOpinionDto);
	}
}
