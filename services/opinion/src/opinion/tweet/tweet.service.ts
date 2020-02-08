import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
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
			const query = TweetService.generateQuery(this.connection.createQueryBuilder(), searchTweetDto);

			if (searchTweetDto.limitPerPolitician) {
				const mainQuery = this.connection.createQueryBuilder()
					.addSelect('*')
					.from(cb => TweetService.generateQuery(cb, searchTweetDto)
						.addSelect('ROW_NUMBER() OVER (PARTITION BY sentiment.politician)', 'row'), 'result')
					.where('row <= :limitPerPolitician', { limitPerPolitician: searchTweetDto.limitPerPolitician });

				const result = await mainQuery.getRawMany();
				return this.toEntities(result);
			}

			return await query.getMany();
		}
		return await this.tweetRepository.find();
	}

	private toEntities(rawResults: any[]): Tweet[] {
		const results: {[key: string]: Tweet} = {};

		for (const rawResult of rawResults) {
			const sentiment: Sentiment = this.sentimentRepository.create({
				politician: rawResult.sentiment_politician,
				value: rawResult.sentiment_value,
				id: rawResult.sentiment_id,
				opinion: rawResult.tweet_id,
			});

			if (results[rawResult.tweet_id]) {
				results[rawResult.tweet_id].sentiments.push(sentiment);
				continue;
			}
			results[rawResult.tweet_id] = this.tweetRepository.create({
				id: rawResult.tweet_id,
				dateTime: rawResult.tweet_dateTime,
				tweetId: rawResult.tweet_tweetId,
				tweetText: rawResult.tweet_tweetText,
				sentiments: [sentiment],
			});
		}

		return Object.values(results);
	}

	private static generateQuery(query: SelectQueryBuilder<any>, searchTweetDto: SearchTweetDto) {
		query.addSelect('tweet')
			.from(Tweet, 'tweet')
			.leftJoinAndSelect('tweet.sentiments', 'sentiment');

		if (searchTweetDto.politicians) {
			query.andWhere('sentiment.politician in (:...politicians)', { politicians: searchTweetDto.politicians });
		}

		if (searchTweetDto.tweetId) {
			query.andWhere('tweet.tweetId = :tweetId', { tweetId: searchTweetDto.tweetId });
		}

		if (searchTweetDto.limit) {
			query.limit(searchTweetDto.limit);
		}

		if (searchTweetDto.offset) {
			query.offset(searchTweetDto.offset);
		}

		return query;
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
		const updateTweetDto = Object.assign({}, createTweetDto) as UpdateTweetDto;

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
