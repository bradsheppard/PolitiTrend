import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { EventPattern } from '@nestjs/microservices';
import Tweet from './tweet.entity';
import { SearchTweetDto } from './dto/search-tweet.dto';

@Controller('tweet')
export class TweetController {
	constructor(private tweetService: TweetService) {}

	@Get()
	async findAll(@Query() query: SearchTweetDto) {
		return await this.tweetService.get(query);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const opinion = await this.tweetService.getOne(parseInt(id, 10));

		if (!opinion) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return opinion;
	}

	@Post()
	async create(@Body() createOpinionDto: CreateTweetDto): Promise<Tweet> {
		return await this.tweetService.insert(createOpinionDto);
	}

	@Delete(':id')
	async deleteOne(@Param('id') id: string) {
		const successful = await this.tweetService.deleteOne(parseInt(id, 10));

		if (!successful) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
	}

	@Delete()
	async delete() {
		await this.tweetService.delete();
	}

	@EventPattern('tweet_created')
	async handleTweetCreated(createOpinionDto: CreateTweetDto) {
		await this.tweetService.upsertOnTweetId(createOpinionDto);
	}
}
