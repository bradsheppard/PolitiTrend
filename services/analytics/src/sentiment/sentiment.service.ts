import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Sentiment } from './interfaces/sentiment.interface';
import { CreateSentimentDto } from './dtos/create-sentiment.dto';

@Injectable()
export class SentimentService {
	constructor(@InjectModel('Sentiment') private readonly sentimentModel: Model<Sentiment>) {}

	async create(createSentimentDto: CreateSentimentDto): Promise<Sentiment> {
		const createSentiment = new this.sentimentModel(createSentimentDto);
		return await createSentiment.save();
	}

	async findByPolitician(id: number): Promise<Sentiment[]> {
		return await this.sentimentModel.find({politician: id}).sort({dateTime: -1}).limit(20).exec()
	}

	async findAll(): Promise<Sentiment[]> {
		const query = this.sentimentModel.aggregate([
			{
				$sort: {
					politician: 1,
					dateTime: -1
				}
			},
			{
				$group: {
					_id: '$politician',
					'id': { $first: '$_id'},
					'politician': { $first: '$politician'},
					'dateTime': { $first: '$dateTime'},
					'sentiment': { $first: '$sentiment'}
				}
			},
			{
				$sort: {
					politician: 1
				}
			},
			{
				$project: {
					_id: 0
				}
			}
		]);

		return await query.exec();
	}

	async delete(): Promise<void> {
		await this.sentimentModel.deleteMany({}).exec();
	}
}
