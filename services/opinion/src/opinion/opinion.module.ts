import { Module } from '@nestjs/common';
import { OpinionController } from './opinion.controller';
import { OpinionService } from './opinion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Opinion from './opinion.entity';

@Module({
	controllers: [OpinionController],
	providers: [OpinionService],
	imports: [TypeOrmModule.forFeature([Opinion])],
	exports: [OpinionService],
})
export class OpinionModule {}
