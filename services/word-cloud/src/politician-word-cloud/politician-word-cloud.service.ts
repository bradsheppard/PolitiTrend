import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePoliticianWordCloudDto } from './dtos/create-politician-word-cloud.dto';
import { PoliticianWordCloud } from './interfaces/politician-word-cloud.interface';
import { FilterQuery, Model } from 'mongoose';
import { SearchPoliticianWordCloudDto } from './dtos/search-politician-word-cloud.dto';

@Injectable()
export class PoliticianWordCloudService {

	constructor(@InjectModel('PoliticianWordCloud') private readonly politicianWordCloudModel: Model<PoliticianWordCloud>) {}

	async create(createWordCloudDto: CreatePoliticianWordCloudDto): Promise<PoliticianWordCloud> {
		const createdWordCloud = new this.politicianWordCloudModel(createWordCloudDto);
		return await createdWordCloud.save()
	}

	async find(searchWordCloudDto: SearchPoliticianWordCloudDto): Promise<PoliticianWordCloud[]> {
		const queryObject: FilterQuery<PoliticianWordCloud> = {};

		if (searchWordCloudDto.politician) {
			queryObject.politician = searchWordCloudDto.politician;
		}

		let query = this.politicianWordCloudModel.find(queryObject);

		if (searchWordCloudDto.limit) {
			query = query.limit(searchWordCloudDto.limit);
		}

		if (searchWordCloudDto.offset) {
			query = query.skip(searchWordCloudDto.offset);
		}

		query = query.sort({dateTime: 'desc'});

		return await query.exec();
	}

	async delete(): Promise<void> {
		await this.politicianWordCloudModel.deleteMany({}).exec();
	}
}
