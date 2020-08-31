import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { EventPattern } from '@nestjs/microservices';
import { SearchTweetDto } from './dto/search-tweet.dto';
import { HealthCheck, HealthCheckResult, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Tweet } from './schemas/tweet.schema';

@Controller()
export class TweetController {
	constructor(
		private tweetService: TweetService,
		private health: HealthCheckService,
		private mongooseHealthIndicator: MongooseHealthIndicator
	) {}

	@Get('/health')
	@HealthCheck()
	healthCheck(): Promise<HealthCheckResult> {
		return this.health.check([
			async () => this.mongooseHealthIndicator.pingCheck('database')
		])
	}

	@Get()
	async findAll(@Query() query: SearchTweetDto): Promise<Tweet[]> {
		return await this.tweetService.get(query);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Tweet> {
		const tweet = await this.tweetService.getOne(id);

		if (!tweet) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return tweet;
	}

	@Post()
	async create(@Body() createOpinionDto: CreateTweetDto): Promise<Tweet> {
		return await this.tweetService.create(createOpinionDto);
	}

	@Delete(':id')
	async deleteOne(@Param('id') id: string): Promise<void> {
		const successful = await this.tweetService.deleteOne(id);

		if (!successful) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
	}

	@Delete()
	async delete(): Promise<void> {
		await this.tweetService.delete();
	}

	@EventPattern('tweet-created')
	async handleTweetCreated(createOpinionDto: CreateTweetDto): Promise<void> {
		await this.tweetService.create(createOpinionDto);
	}
}
