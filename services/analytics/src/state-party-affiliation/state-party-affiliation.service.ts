import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';
import { CreateStatePartyAffiliationDto } from './dtos/create-state-party-affiliation-dto';

@Injectable()
export class StatePartyAffiliationService {
	constructor(@InjectModel('StatePartyAffiliation') private readonly statePartyAffiliationModel: Model<StatePartyAffiliation>) {}

	async findAll(): Promise<StatePartyAffiliation[]> {
		const query = this.statePartyAffiliationModel.aggregate([
			{
				$sort: {
					state: 1,
					dateTime: -1
				}
			},
			{
				$group: {
					_id: '$state',
					'id': { $first: '$_id'},
					'state': { $first: '$state'},
					'dateTime': { $first: '$dateTime'},
					'affiliations': { $first: '$affiliations'},
					'sampleSize': { $first: '$sampleSize'}
				}
			},
			{
				$sort: {
					state: 1
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

	async create(createStatePartyAffiliation: CreateStatePartyAffiliationDto): Promise<StatePartyAffiliation> {
		const createSentiment = new this.statePartyAffiliationModel(createStatePartyAffiliation);
		return await createSentiment.save();
	}

	async delete(): Promise<void> {
		await this.statePartyAffiliationModel.deleteMany({}).exec();
	}
}
