import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Sentiment } from './interfaces/sentiment.interface';
import { CreateSentimentDto } from './dtos/create-sentiment.dto';
import { SearchSentimentDto } from './dtos/search-sentiment.dto';

@Injectable()
export class SentimentService {

	private static SAMPLING_RATE = 86400000;

	constructor(@InjectModel('Sentiment') private readonly sentimentModel: Model<Sentiment>) {}

	async create(createSentimentDto: CreateSentimentDto): Promise<Sentiment> {
		const createSentiment = new this.sentimentModel(createSentimentDto);
		return await createSentiment.save();
	}

	private static generateGroupClause() {
		return {
			_id: {
				'dateTime': {
					$subtract: ["$dateTime", {
						$mod: [{
							$toLong: "$dateTime"
						}, SentimentService.SAMPLING_RATE]
					}]
				},
				'politician': '$politician'
			},
			total: { $sum: 1 },
			sampleSize: { $sum: '$sampleSize' },
			weightedSentiment: { $sum: {$multiply: ['$sentiment', '$sampleSize']} }
		}
	}

	private static generateMatchFilter(searchSentimentDto: SearchSentimentDto) {
		const filter: any = {};

		if (searchSentimentDto.politician)
			filter.politician = searchSentimentDto.politician

		if (searchSentimentDto.start && searchSentimentDto.end)
			filter.dateTime = {
				$lte: searchSentimentDto.end,
				$gte: searchSentimentDto.start
			};
		else if (searchSentimentDto.start)
			filter.dateTime = {
				$gte: searchSentimentDto.start
			};
		else if (searchSentimentDto.end)
			filter.dateTime = {
				$lte: searchSentimentDto.end
			};

		return filter
	}

	async find(searchSentimentDto: SearchSentimentDto): Promise<Sentiment[]> {
		const aggregations: any[] = [
			{
				$match: SentimentService.generateMatchFilter(searchSentimentDto)
			},
			{
				$group: SentimentService.generateGroupClause()
			},
			{
				$project: {
					_id: false,
					sentiment: {$divide: ['$weightedSentiment', '$sampleSize']},
					sampleSize: true,
					politician: '$_id.politician',
					dateTime: '$_id.dateTime'
				}
			},
			{
				$sort: {
					politician: 1,
					dateTime: -1
				}
			}
		]

		if(searchSentimentDto.minSampleSize)
			aggregations.splice(3, 0,{
				$match: { sampleSize: { $gte: searchSentimentDto.minSampleSize }}
			},)

		const query = this.sentimentModel.aggregate(aggregations);

		return await query.exec();
	}

	async delete(): Promise<void> {
		await this.sentimentModel.deleteMany({}).exec();
	}
}
