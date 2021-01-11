import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatePartyAffiliation } from './interfaces/state-party-affiliation.interface';
import { CreateStatePartyAffiliationDto } from './dtos/create-state-party-affiliation-dto';
import { SearchStatePartyAffiliationDto } from './dtos/search-state-party-affiliation.dto';

@Injectable()
export class StatePartyAffiliationService {
    constructor(
        @InjectModel('StatePartyAffiliation')
        private readonly statePartyAffiliationModel: Model<StatePartyAffiliation>,
    ) {}

    async find(searchStatePartyAffiliationDto: SearchStatePartyAffiliationDto): Promise<StatePartyAffiliation[]> {
        if (searchStatePartyAffiliationDto.resample) return await this.findWithResampling(searchStatePartyAffiliationDto);

        return await this.findWithoutResampling(searchStatePartyAffiliationDto);
    }

    private static generateGroupClause(resamplingRate: number) {
        return {
            _id: {
                dateTime: {
                    $subtract: [
                        '$dateTime',
                        {
                            $mod: [
                                {
                                    $toLong: '$dateTime',
                                },
                                resamplingRate,
                            ],
                        },
                    ],
                },
                state: '$state',
            },
            sampleSize: { $sum: '$sampleSize' },
            total: { $sum: 1 },
            avgSampleSize: { $avg: '$sampleSize' },
            weightedDemocraticSentiment: {
                $sum: {
                    $multiply: ['$affiliations.democratic', '$sampleSize'],
                },
            },
            weightedRepublicanSentiment: {
                $sum: {
                    $multiply: ['$affiliations.republican', '$sampleSize'],
                },
            },
        };
    }

    private static generateMatchFilter(searchStatePartyAffiliationDto: SearchStatePartyAffiliationDto) {
        const filter: any = {};

        if (searchStatePartyAffiliationDto.start && searchStatePartyAffiliationDto.end)
            filter.dateTime = {
                $lte: searchStatePartyAffiliationDto.end,
                $gte: searchStatePartyAffiliationDto.start,
            };
        else if (searchStatePartyAffiliationDto.start)
            filter.dateTime = {
                $gte: searchStatePartyAffiliationDto.start,
            };
        else if (searchStatePartyAffiliationDto.end)
            filter.dateTime = {
                $lte: searchStatePartyAffiliationDto.end,
            };

        return filter;
    }

    private async findWithResampling(
        searchStatePartyAffiliationDto: SearchStatePartyAffiliationDto,
    ): Promise<StatePartyAffiliation[]> {
        const aggregations: any[] = [
            {
                $match: StatePartyAffiliationService.generateMatchFilter(searchStatePartyAffiliationDto),
            },
            {
                $group: StatePartyAffiliationService.generateGroupClause(
                    searchStatePartyAffiliationDto.resample,
                ),
            },
            {
                $project: {
                    _id: false,
                    affiliations: {
                        republican: {
                            $divide: ['$weightedRepublicanSentiment', '$sampleSize'],
                        },
                        democratic: {
                            $divide: ['$weightedDemocraticSentiment', '$sampleSize'],
                        },
                    },
                    sampleSize: '$avgSampleSize',
                    state: '$_id.state',
                    dateTime: '$_id.dateTime',
                },
            },
            {
                $sort: {
                    state: 1,
                    dateTime: -1,
                },
            },
        ];

        if (searchStatePartyAffiliationDto.minSampleSize)
            aggregations.splice(3, 0, {
                $match: {
                    sampleSize: { $gte: searchStatePartyAffiliationDto.minSampleSize },
                },
            });

        const query = this.statePartyAffiliationModel.aggregate(aggregations);

        return await query.exec();
    }

    private async findWithoutResampling(
        searchStatePartyAffiliationDto: SearchStatePartyAffiliationDto,
    ): Promise<StatePartyAffiliation[]> {
        const aggregations: any[] = [
            {
                $match: StatePartyAffiliationService.generateMatchFilter(searchStatePartyAffiliationDto),
            },
            {
                $sort: {
                    politician: 1,
                    dateTime: -1,
                },
            },
        ];

        if (searchStatePartyAffiliationDto.minSampleSize)
            aggregations.splice(3, 0, {
                $match: {
                    sampleSize: { $gte: searchStatePartyAffiliationDto.minSampleSize },
                },
            });

        const query = this.statePartyAffiliationModel.aggregate(aggregations);

        return await query.exec();
    }

    async create(
        createStatePartyAffiliation: CreateStatePartyAffiliationDto,
    ): Promise<StatePartyAffiliation> {
        const createSentiment = new this.statePartyAffiliationModel(createStatePartyAffiliation);
        return await createSentiment.save();
    }

    async delete(): Promise<void> {
        await this.statePartyAffiliationModel.deleteMany({}).exec();
    }
}
