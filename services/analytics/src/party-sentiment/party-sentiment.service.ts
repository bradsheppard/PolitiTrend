import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PartySentiment } from './interfaces/party-sentiment.interface';
import { CreatePartySentimentDto } from './dtos/create-party-sentiment.dto';
import { SearchPartySentimentDto } from './dtos/search-party-sentiment.dto';

@Injectable()
export class PartySentimentService {
	constructor(
		@InjectModel('PartySentiment')
		private readonly partySentimentModel: Model<PartySentiment>,
	) {}

	async create(createPartySentimentDto: CreatePartySentimentDto): Promise<PartySentiment> {
		const createSentiment = new this.partySentimentModel(createPartySentimentDto);
		return await createSentiment.save();
	}

	private static generateGroupClause(resamplingRate: number) {
		return {
			_id: {
				dateTime: {
					$add: [
						'$dateTime',
						{
							$mod: [
								{
									$subtract: ['$$NOW', '$dateTime'],
								},
								resamplingRate,
							],
						},
					],
				},
				party: '$party',
			},
			sampleSize: { $sum: '$sampleSize' },
			total: { $sum: 1 },
			avgSampleSize: { $avg: '$sampleSize' },
			weightedSentiment: {
				$sum: { $multiply: ['$sentiment', '$sampleSize'] },
			},
		};
	}

	private static generateMatchFilter(searchSentimentDto: SearchPartySentimentDto) {
		const filter: any = {};

		if (searchSentimentDto.party) filter.party = searchSentimentDto.party;

		if (searchSentimentDto.start && searchSentimentDto.end)
			filter.dateTime = {
				$lte: searchSentimentDto.end,
				$gte: searchSentimentDto.start,
			};
		else if (searchSentimentDto.start)
			filter.dateTime = {
				$gte: searchSentimentDto.start,
			};
		else if (searchSentimentDto.end)
			filter.dateTime = {
				$lte: searchSentimentDto.end,
			};

		return filter;
	}

	async findWithResampling(searchSentimentDto: SearchPartySentimentDto): Promise<PartySentiment[]> {
		const aggregations: any[] = [
			{
				$match: PartySentimentService.generateMatchFilter(searchSentimentDto),
			},
			{
				$group: PartySentimentService.generateGroupClause(searchSentimentDto.resample),
			},
			{
				$project: {
					_id: false,
					sentiment: {
						$divide: ['$weightedSentiment', '$sampleSize'],
					},
					sampleSize: '$avgSampleSize',
					party: '$_id.party',
					dateTime: '$_id.dateTime',
				},
			},
			{
				$sort: {
					party: 1,
					dateTime: -1,
				},
			},
		];

		if (searchSentimentDto.minSampleSize)
			aggregations.splice(3, 0, {
				$match: {
					sampleSize: { $gte: searchSentimentDto.minSampleSize },
				},
			});

		const query = this.partySentimentModel.aggregate(aggregations);

		return await query.exec();
	}

	async findWithoutResampling(searchSentimentDto: SearchPartySentimentDto): Promise<PartySentiment[]> {
		const aggregations: any[] = [
			{
				$match: PartySentimentService.generateMatchFilter(searchSentimentDto),
			},
			{
				$sort: {
					party: 1,
					dateTime: -1,
				},
			},
		];

		if (searchSentimentDto.minSampleSize)
			aggregations.splice(3, 0, {
				$match: {
					sampleSize: { $gte: searchSentimentDto.minSampleSize },
				},
			});

		const query = this.partySentimentModel.aggregate(aggregations);

		return await query.exec();
	}

	async find(searchSentimentDto: SearchPartySentimentDto): Promise<PartySentiment[]> {
		if (searchSentimentDto.resample) return await this.findWithResampling(searchSentimentDto);

		return await this.findWithoutResampling(searchSentimentDto);
	}

	async delete(): Promise<void> {
		await this.partySentimentModel.deleteMany({}).exec();
	}
}
