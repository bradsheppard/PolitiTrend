import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PoliticianSentiment } from './interfaces/politician-sentiment.interface';
import { CreatePoliticianSentimentDto } from './dtos/create-politician-sentiment.dto';
import { SearchPoliticianSentimentDto } from './dtos/search-politician-sentiment.dto';

@Injectable()
export class PoliticianSentimentService {
    constructor(
        @InjectModel('PoliticianSentiment')
        private readonly politicianSentimentModel: Model<PoliticianSentiment>,
    ) {}

    async create(createSentimentDto: CreatePoliticianSentimentDto): Promise<PoliticianSentiment> {
        const createSentiment = new this.politicianSentimentModel(createSentimentDto);
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
                politician: '$politician',
            },
            sampleSize: { $sum: '$sampleSize' },
            total: { $sum: 1 },
            avgSampleSize: { $avg: '$sampleSize' },
            weightedSentiment: {
                $sum: { $multiply: ['$sentiment', '$sampleSize'] },
            },
        };
    }

    private static generateMatchFilter(searchSentimentDto: SearchPoliticianSentimentDto) {
        const filter: any = {};

        if (searchSentimentDto.politician) filter.politician = searchSentimentDto.politician;

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

    async findWithResampling(searchSentimentDto: SearchPoliticianSentimentDto): Promise<PoliticianSentiment[]> {
        const aggregations: any[] = [
            {
                $match: PoliticianSentimentService.generateMatchFilter(searchSentimentDto),
            },
            {
                $group: PoliticianSentimentService.generateGroupClause(searchSentimentDto.resample),
            },
            {
                $project: {
                    _id: false,
                    sentiment: {
                        $divide: ['$weightedSentiment', '$sampleSize'],
                    },
                    sampleSize: '$avgSampleSize',
                    politician: '$_id.politician',
                    dateTime: '$_id.dateTime',
                },
            },
            {
                $sort: {
                    politician: 1,
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

        const query = this.politicianSentimentModel.aggregate(aggregations);

        return await query.exec();
    }

    async findWithoutResampling(searchSentimentDto: SearchPoliticianSentimentDto): Promise<PoliticianSentiment[]> {
        const aggregations: any[] = [
            {
                $match: PoliticianSentimentService.generateMatchFilter(searchSentimentDto),
            },
            {
                $sort: {
                    politician: 1,
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

        const query = this.politicianSentimentModel.aggregate(aggregations);

        return await query.exec();
    }

    async find(searchSentimentDto: SearchPoliticianSentimentDto): Promise<PoliticianSentiment[]> {
        if (searchSentimentDto.resample) return await this.findWithResampling(searchSentimentDto);

        return await this.findWithoutResampling(searchSentimentDto);
    }

    async delete(): Promise<void> {
        await this.politicianSentimentModel.deleteMany({}).exec();
    }
}
