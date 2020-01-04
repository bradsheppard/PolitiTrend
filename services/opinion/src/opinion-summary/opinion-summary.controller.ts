import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { OpinionSummaryService } from './opinion-summary.service';
import { SearchOpinionSummaryDto } from './dto/search-opinion-summary.dto';

@Controller('opinionsummary')
export class OpinionSummaryController {
	constructor(private opinionSummaryService: OpinionSummaryService) {}

	@Get()
	async findAll(@Query() searchOpinionSummaryDto: SearchOpinionSummaryDto) {
		return await this.opinionSummaryService.get();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const opinionSummary = await this.opinionSummaryService.getOne(parseInt(id, 10));

		if (!opinionSummary) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return opinionSummary;
	}
}
