import { Module } from '@nestjs/common';
import { OpinionSummaryJobController } from './opinion-summary-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionSummaryJobService } from './opinion-summary-job.service';
import OpinionSummaryJob from './opinion-summary-job.entity';
import { OpinionSummaryModule } from '../opinion-summary/opinion-summary.module';
import { SentimentModule } from '../sentiment/sentiment.module';

@Module({
	controllers: [OpinionSummaryJobController],
	imports: [TypeOrmModule.forFeature([OpinionSummaryJob]), SentimentModule, OpinionSummaryModule],
	providers: [OpinionSummaryJobService],
})
export class OpinionSummaryJobModule {}
