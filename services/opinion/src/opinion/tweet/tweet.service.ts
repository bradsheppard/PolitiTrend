import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import Tweet from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Sentiment } from '../../sentiment/sentiment.entity';
import { SearchTweetDto } from './dto/search-tweet.dto';

@Injectable()
export class TweetService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(Tweet)
		private readonly tweetRepository: Repository<Tweet>,
		@InjectRepository(Sentiment)
		private readonly sentimentRepository: Repository<Sentiment>,
	) {}

	async deleteOne(id: number): Promise<boolean> {
		const tweet = await this.tweetRepository.findOne(id.toString());

		if (!tweet) {
			return false;
		}

		await this.tweetRepository.remove(tweet);

		return true;
	}

	async delete(): Promise<void> {
		await this.tweetRepository.delete({});
	}

	async get(searchTweetDto?: SearchTweetDto): Promise<Tweet[]> {
		if (searchTweetDto) {
			const query = await this.connection.createQueryBuilder()
				.select('tweet')
				.from(Tweet, 'tweet')
				.innerJoinAndSelect('tweet.sentiments', 'sentiment');

			if (searchTweetDto.politician) {
				query.andWhere('sentiment.politician = :politician', { politician: searchTweetDto.politician });
			}
			if (searchTweetDto.tweetId) {
				query.andWhere('tweet.tweetId = :tweetId', { tweetId: searchTweetDto.tweetId });
			}

			return await query.getMany();
		}
		return await this.tweetRepository.find();
	}

	async getOne(id: number): Promise<Tweet | null> {
		const tweet = await this.tweetRepository.findOne(id);

		return tweet !== undefined ? tweet : null;
	}

	async insert(entity: CreateTweetDto): Promise<Tweet> {
		const sentiments = [];

		for (const sentiment of entity.sentiments) {
			const insertedSentiment = await this.sentimentRepository.save(this.sentimentRepository.create(sentiment));
			sentiments.push(insertedSentiment);
		}

		entity.sentiments = sentiments;
		return await this.tweetRepository.save(this.tweetRepository.create(entity));
	}

	async update(entity: UpdateTweetDto): Promise<boolean> {
		const tweet = await this.tweetRepository.findOne(entity.id);

		if (!tweet) {
			return false;
		}

		const sentiments = [];
		for (const sentiment of entity.sentiments) {
			const insertedSentiment = await this.sentimentRepository.save(this.sentimentRepository.create(sentiment));
			sentiments.push(insertedSentiment);
		}
		entity.sentiments = sentiments;

		await this.tweetRepository.save(this.tweetRepository.create(entity));
		return true;
	}

	async upsertOnTweetId(createTweetDto: CreateTweetDto): Promise<Tweet> {
		const updateTweetDto = createTweetDto as UpdateTweetDto;

		const previousTweets = await this.get({tweetId: createTweetDto.tweetId});
		if (previousTweets.length > 0) {
			updateTweetDto.id = previousTweets[0].id;
		}

		const sentiments = [];
		for (const sentiment of createTweetDto.sentiments) {
			const insertedSentiment = await this.sentimentRepository.save(this.sentimentRepository.create(sentiment));
			sentiments.push(insertedSentiment);
		}

		updateTweetDto.sentiments = sentiments;

		const result = await this.tweetRepository.save(this.tweetRepository.create(updateTweetDto));
		return await this.tweetRepository.findOne(result.id);
	}
}
