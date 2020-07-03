import { Module } from '@nestjs/common';
import { PoliticianWordCloudModule } from './politician-word-cloud/politician-word-cloud.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalWordCloudModule } from './global-word-cloud/global-word-cloud.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { StatePartyAffiliationModule } from './state-party-affiliation/state-party-affiliation.module';

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
					useCreateIndex: true
				}
			},
			inject: [ConfigService]
		}),
		PoliticianWordCloudModule,
		GlobalWordCloudModule,
		SentimentModule,
		StatePartyAffiliationModule
	]
})
export class AppModule {}
