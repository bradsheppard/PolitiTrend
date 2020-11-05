import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';
import { CreateStatePartyAffiliationDto } from './dtos/create-state-party-affiliation-dto';
import { SearchSentimentDto } from '../sentiment/dtos/search-sentiment.dto';

@Injectable()
export class StatePartyAffiliationService {
	constructor(@InjectModel('StatePartyAffiliation') private readonly statePartyAffiliationModel: Model<StatePartyAffiliation>) {}

	async find(searchSentimentDto: SearchSentimentDto): Promise<StatePartyAffiliation[]> {
		if(searchSentimentDto.resample)
			return await this.findWithResampling(searchSentimentDto);

		return await this.findWithoutResampling(searchSentimentDto);
	}

	private static generateGroupClause(resamplingRate: number) {
		return {
			_id: {
				'dateTime': {
					$subtract: ["$dateTime", {
						$mod: [{
							$toLong: "$dateTime"
						}, resamplingRate]
					}]
				},
				'state': '$state'
			},
			sampleSize: { $sum: '$sampleSize' },
			total: { $sum: 1 },
			avgSampleSize: { $avg: '$sampleSize' },
			weightedDemocraticSentiment: { $sum: {$multiply: ['$affiliations.democratic', '$sampleSize']} },
			weightedRepublicanSentiment: { $sum: {$multiply: ['$affiliations.republican', '$sampleSize']} }
		}
	}

	private static generateMatchFilter(searchSentimentDto: SearchSentimentDto) {
		const filter: any = {};

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

	private async findWithResampling(searchSentimentDto: SearchSentimentDto): Promise<StatePartyAffiliation[]> {
		const aggregations: any[] = [
			{
				$match: StatePartyAffiliationService.generateMatchFilter(searchSentimentDto)
			},
			{
				$group: StatePartyAffiliationService.generateGroupClause(searchSentimentDto.resample)
			},
			{
				$project: {
					_id: false,
					affiliations: {
						republican: { $divide: ['$weightedRepublicanSentiment', '$sampleSize'] },
						democratic: { $divide: ['$weightedDemocraticSentiment', '$sampleSize'] }
					},
					sampleSize: '$avgSampleSize',
					state: '$_id.state',
					dateTime: '$_id.dateTime'
				}
			},
			{
				$sort: {
					state: 1,
					dateTime: -1
				}
			}
		]

		if(searchSentimentDto.minSampleSize)
			aggregations.splice(3, 0,{
				$match: { sampleSize: { $gte: searchSentimentDto.minSampleSize }}
			});

		const query = this.statePartyAffiliationModel.aggregate(aggregations);

		return await query.exec();
	}

	private async findWithoutResampling(searchSentimentDto: SearchSentimentDto): Promise<StatePartyAffiliation[]> {
		const aggregations: any[] = [
			{
				$match: StatePartyAffiliationService.generateMatchFilter(searchSentimentDto)
			},
			{
				$sort: {
					politician: 1,
					dateTime: -1
				}
			}
		]

		if(searchSentimentDto.minSampleSize)
			aggregations.splice(3, 0, {
				$match: { sampleSize: { $gte: searchSentimentDto.minSampleSize }}
			});

		const query = this.statePartyAffiliationModel.aggregate(aggregations);

		return await query.exec();
	}

	async create(createStatePartyAffiliation: CreateStatePartyAffiliationDto): Promise<StatePartyAffiliation> {
		const createSentiment = new this.statePartyAffiliationModel(createStatePartyAffiliation);
		return await createSentiment.save();
	}

	async delete(): Promise<void> {
		await this.statePartyAffiliationModel.deleteMany({}).exec();
	}
}
