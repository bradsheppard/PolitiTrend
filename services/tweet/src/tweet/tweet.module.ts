import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './schemas/tweet.schema';

@Module({
	controllers: [TweetController],
	providers: [TweetService],
	imports: [
		MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
		TerminusModule
	],
})
export class TweetModule {}
