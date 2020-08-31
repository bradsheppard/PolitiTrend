import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TweetModule } from './tweet/tweet.module';

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
		TweetModule
	],
})
export class AppModule {}
