import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateWordCloudDto } from './dto/create-word-cloud.dto';
import { WordCloud } from './interfaces/word-cloud.interface';
import { Model } from 'mongoose';
import { SearchWordCloudDto } from './dto/search-word-cloud.dto';

@Injectable()
export class WordCloudService {

	constructor(@InjectModel('WordCloud') private readonly wordCloudModel: Model<WordCloud>) {}

	async create(createWordCloudDto: CreateWordCloudDto): Promise<WordCloud> {
		const createdWordCloud = new this.wordCloudModel(createWordCloudDto);
		return await createdWordCloud.save()
	}

	async find(searchWordCloudDto: SearchWordCloudDto): Promise<WordCloud[]> {
		return await this.wordCloudModel.find(searchWordCloudDto).exec()
	}

	async delete(): Promise<void> {
		await this.wordCloudModel.deleteMany({}).exec();
	}
}
