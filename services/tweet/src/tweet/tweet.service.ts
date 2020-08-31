import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { SearchTweetDto } from './dto/search-tweet.dto';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Tweet } from './schemas/tweet.schema';

@Injectable()
export class TweetService {

	private static readonly MAX_LIMIT = 50;
	private static readonly DEFAULT_LIMIT = 10;

	constructor(@InjectModel(Tweet.name) private readonly tweetModel: Model<Tweet>) {}

	async deleteOne(id: string): Promise<boolean> {
		const deleteResult = await this.tweetModel.deleteOne({_id: id}).exec();
		return deleteResult.deletedCount > 0;
	}

	async delete(): Promise<void> {
		await this.tweetModel.deleteMany({}).exec();
	}

	async get(searchTweetDto: SearchTweetDto): Promise<Tweet[]> {
		let query = this.tweetModel.find();

		if (searchTweetDto.politician) {
			query = query.find({politicians: searchTweetDto.politician})
		}

		if (searchTweetDto.limit) {
			query = query.limit(Math.min(searchTweetDto.limit, TweetService.MAX_LIMIT));
		}
		else {
			query = query.limit(TweetService.DEFAULT_LIMIT)
		}

		if (searchTweetDto.offset) {
			query = query.skip(searchTweetDto.offset);
		}

		query = query.sort({dateTime: 'desc'});

		return await query.exec();
	}
	async getOne(id: string): Promise<Tweet | null> {
		return await this.tweetModel.findById(id).exec();
	}

	async create(createTweetDto: CreateTweetDto): Promise<Tweet> {
		return await this.tweetModel.findOneAndUpdate({ tweetId: createTweetDto.tweetId }, createTweetDto, {
			upsert: true,
			new: true
		}).exec();
	}
}
