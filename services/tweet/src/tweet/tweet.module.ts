import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Tweet from './tweet.entity';
import { TerminusModule } from '@nestjs/terminus';

@Module({
	controllers: [TweetController],
	providers: [TweetService],
	imports: [TypeOrmModule.forFeature([Tweet]), TerminusModule],
})
export class TweetModule {}
