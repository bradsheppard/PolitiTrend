import { Module } from '@nestjs/common';
import { TweetModule } from './tweet/tweet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionSummaryModule } from './opinion-summary/opinion-summary.module';
import { OpinionSummaryJobModule } from './opinion-summary-job/opinion-summary-job.module';

@Module({
	imports: [TypeOrmModule.forRoot(), OpinionSummaryModule, OpinionSummaryJobModule, TweetModule],
})
export class AppModule {}
