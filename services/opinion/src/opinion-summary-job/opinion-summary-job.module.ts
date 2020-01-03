import { Module } from '@nestjs/common';
import { OpinionSummaryJobController } from './opinion-summary-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionSummaryJobService } from './opinion-summary-job.service';
import OpinionSummaryJob from './opinion-summary-job.entity';
import { OpinionModule } from '../opinion/opinion.module';
import { OpinionSummaryModule } from '../opinion-summary/opinion-summary.module';

@Module({
	controllers: [OpinionSummaryJobController],
	imports: [TypeOrmModule.forFeature([OpinionSummaryJob]), OpinionModule, OpinionSummaryModule],
	providers: [OpinionSummaryJobService],
})
export class OpinionSummaryJobModule {}
