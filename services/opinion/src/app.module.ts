import { Module } from '@nestjs/common';
import { TweetModule } from './opinion/tweet/tweet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionSummaryModule } from './opinion-summary/opinion-summary.module';
import { OpinionSummaryJobModule } from './opinion-summary-job/opinion-summary-job.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './terminus-options/terminus-options.service';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		OpinionSummaryModule,
		OpinionSummaryJobModule,
		SentimentModule,
		TweetModule,
		TerminusModule.forRootAsync({
			useClass: TerminusOptionsService,
		}),
	],
})
export class AppModule {}
