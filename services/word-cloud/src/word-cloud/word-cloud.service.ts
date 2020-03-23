import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateWordCloudDto } from './dto/create-word-cloud.dto';
import { WordCloud } from './interfaces/word-cloud.interface';
import { FilterQuery, Model } from 'mongoose';
import { SearchWordCloudDto } from './dto/search-word-cloud.dto';

@Injectable()
export class WordCloudService {

	constructor(@InjectModel('WordCloud') private readonly wordCloudModel: Model<WordCloud>) {}

	async create(createWordCloudDto: CreateWordCloudDto): Promise<WordCloud> {
		const createdWordCloud = new this.wordCloudModel(createWordCloudDto);
		return await createdWordCloud.save()
	}

	async find(searchWordCloudDto: SearchWordCloudDto): Promise<WordCloud[]> {
		const queryObject: FilterQuery<WordCloud> = {};

		if (searchWordCloudDto.politician) {
			queryObject.politician = searchWordCloudDto.politician;
		}

		let query = this.wordCloudModel.find(queryObject);

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
		await this.wordCloudModel.deleteMany({}).exec();
	}
}
