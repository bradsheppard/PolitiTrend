import { Module } from '@nestjs/common';
import { PoliticianWordCloudModule } from './politician-word-cloud/politician-word-cloud.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalWordCloudModule } from './global-word-cloud/global-word-cloud.module';
import { PoliticianSentimentModule } from './politician-sentiment/politician-sentiment.module';
import { StatePartyAffiliationModule } from './state-party-affiliation/state-party-affiliation.module';
import { PartySentimentModule } from './party-sentiment/party-sentiment.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forRoot()],
            useFactory: async (configService: ConfigService) => {
                return {
                    useFindAndModify: false,
                    uri: configService.get<string>('MONGODB_URI'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                };
            },
            inject: [ConfigService],
        }),
        PoliticianWordCloudModule,
        GlobalWordCloudModule,
        PoliticianSentimentModule,
        StatePartyAffiliationModule,
        PartySentimentModule,
    ],
})
export class AppModule {}
