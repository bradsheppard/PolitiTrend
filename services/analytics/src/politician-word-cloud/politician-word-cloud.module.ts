import { Module } from '@nestjs/common';
import { PoliticianWordCloudController } from './politician-word-cloud.controller';
import { PoliticianWordCloudService } from './politician-word-cloud.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PoliticianWordCloudSchema } from './schemas/politician-word-cloud.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'PoliticianWordCloud', schema: PoliticianWordCloudSchema },
        ]),
    ],
    controllers: [PoliticianWordCloudController],
    providers: [PoliticianWordCloudService],
})
export class PoliticianWordCloudModule {}
