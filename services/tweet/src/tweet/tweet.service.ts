import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import Tweet from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { SearchTweetDto } from './dto/search-tweet.dto';

@Injectable()
export class TweetService {

	constructor(
		@InjectConnection()
		private readonly connection: Connection,
		@InjectRepository(Tweet)
		private readonly tweetRepository: Repository<Tweet>,
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

			return await query.getMany();
		}
		return await this.tweetRepository.find();
	}

	private static generateQuery(query: SelectQueryBuilder<any>, searchTweetDto: SearchTweetDto) {
		query.addSelect('tweet')
			.from(Tweet, 'tweet');

		if (searchTweetDto.politician) {
			query.andWhere(':politician = ANY(tweet.politicians)', { politician: searchTweetDto.politician });
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

		query.orderBy('tweet.dateTime', 'DESC');

		return query;
	}

	async getOne(id: number): Promise<Tweet | null> {
		const tweet = await this.tweetRepository.findOne(id);

		return tweet !== undefined ? tweet : null;
	}

	async insert(entity: CreateTweetDto): Promise<Tweet> {
		return await this.tweetRepository.save(this.tweetRepository.create(entity));
	}

	async update(entity: UpdateTweetDto): Promise<boolean> {
		const tweet = await this.tweetRepository.findOne(entity.id);

		if (!tweet) {
			return false;
		}

		await this.tweetRepository.save(this.tweetRepository.create(entity));
		return true;
	}

	async upsertOnTweetId(createTweetDto: CreateTweetDto): Promise<Tweet> {
		const updateTweetDto = Object.assign({}, createTweetDto) as UpdateTweetDto;

		const previousTweets = await this.get({tweetId: createTweetDto.tweetId});
		if (previousTweets.length > 0) {
			updateTweetDto.id = previousTweets[0].id;
		}

		return await this.tweetRepository.save(this.tweetRepository.create(updateTweetDto));
	}
}
