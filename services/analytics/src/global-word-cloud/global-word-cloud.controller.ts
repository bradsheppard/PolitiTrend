import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GlobalWordCloudService } from './global-word-cloud.service';
import { SearchGlobalWordCloudDto } from './dtos/search-global-word-cloud.dto';
import { GlobalWordCloud } from './interfaces/global-word-cloud.interface';
import { CreateGlobalWordCloudDto } from './dtos/create-global-word-cloud.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('global-word-cloud')
export class GlobalWordCloudController {
    constructor(private globalWordCloudService: GlobalWordCloudService) {}

    @Get()
    async findAll(
        @Query() searchGlobalWordCloudDto: SearchGlobalWordCloudDto,
    ): Promise<GlobalWordCloud[]> {
        return await this.globalWordCloudService.find(searchGlobalWordCloudDto);
    }

    @Post()
    async create(
        @Body() createGlobalWordCloudDto: CreateGlobalWordCloudDto,
    ): Promise<GlobalWordCloud> {
        return await this.globalWordCloudService.create(createGlobalWordCloudDto);
    }

    @EventPattern('analytics-global-word-cloud-created')
    async handleGlobalWordCloudCreated(createGlobalWordCloudDto: CreateGlobalWordCloudDto) {
        await this.globalWordCloudService.create(createGlobalWordCloudDto);
    }
}
