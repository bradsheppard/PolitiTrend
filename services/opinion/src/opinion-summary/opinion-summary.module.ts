import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionSummaryController } from './opinion-summary.controller';
import { OpinionSummaryService } from './opinion-summary.service';
import OpinionSummary from './opinion-summary.entity';

@Module({
	controllers: [OpinionSummaryController],
	providers: [OpinionSummaryService],
	imports: [TypeOrmModule.forFeature([OpinionSummary])],
	exports: [OpinionSummaryService],
})
export class OpinionSummaryModule {}
