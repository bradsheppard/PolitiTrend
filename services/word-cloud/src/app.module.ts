import { Module } from '@nestjs/common';
import { WordCloudModule } from './word-cloud/word-cloud.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule.forRoot()],
			useFactory: async (configService: ConfigService) => {
				return {
					uri: configService.get<string>('MONGODB_URI')
				}
			},
			inject: [ConfigService]
		}),
		WordCloudModule,
	],
})
export class AppModule {}
