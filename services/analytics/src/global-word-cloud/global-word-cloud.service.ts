import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { GlobalWordCloud } from './interfaces/global-word-cloud.interface';
import { CreateGlobalWordCloudDto } from './dtos/create-global-word-cloud.dto';
import { SearchGlobalWordCloudDto } from './dtos/search-global-word-cloud.dto';

@Injectable()
export class GlobalWordCloudService {
	constructor(@InjectModel('GlobalWordCloud') private readonly globalWordCloudModel: Model<GlobalWordCloud>) {}

	async create(createWordCloudDto: CreateGlobalWordCloudDto): Promise<GlobalWordCloud> {
		const createdWordCloud = new this.globalWordCloudModel(createWordCloudDto);
		return await createdWordCloud.save()
	}

	async find(searchWordCloudDto: SearchGlobalWordCloudDto): Promise<GlobalWordCloud[]> {
		let query = this.globalWordCloudModel.find();

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
		await this.globalWordCloudModel.deleteMany({}).exec();
	}
}
