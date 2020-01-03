import { Module } from '@nestjs/common';
import { OpinionModule } from './opinion/opinion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionSummaryModule } from './opinion-summary/opinion-summary.module';
import { OpinionSummaryJobModule } from './opinion-summary-job/opinion-summary-job.module';

@Module({
	imports: [TypeOrmModule.forRoot(), OpinionSummaryModule, OpinionSummaryJobModule, OpinionModule],
})
export class AppModule {}
