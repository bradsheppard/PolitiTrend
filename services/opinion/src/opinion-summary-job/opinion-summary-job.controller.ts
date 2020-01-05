import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { OpinionSummaryJobService } from './opinion-summary-job.service';
import { CreateOpinionSummaryJobDto } from './dto/create-opinion-summary-job.dto';
import { OpinionService } from '../opinion/opinion.service';
import OpinionSummaryJob, { JobStatus } from './opinion-summary-job.entity';
import { OpinionSummaryService } from '../opinion-summary/opinion-summary.service';
import { CreateOpinionSummaryDto } from '../opinion-summary/dto/create-opinion-summary.dto';

@Controller('job/opinionsummary')
export class OpinionSummaryJobController {

	constructor(
		private readonly opinionService: OpinionService,
		private readonly opinionSummaryService: OpinionSummaryService,
		private readonly opinionSummaryJobService: OpinionSummaryJobService,
	) {}

	@Get()
	async findAll() {
		return await this.opinionSummaryJobService.get();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const opinionSummaryJob = await this.opinionSummaryJobService.getOne(parseInt(id, 10));

		if (!opinionSummaryJob) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return opinionSummaryJob;
	}

	@Post()
	async create(@Body() createOpinionSummaryJobDto: CreateOpinionSummaryJobDto): Promise<OpinionSummaryJob> {
		const opinionSummaryJob = await this.opinionSummaryJobService.insert(createOpinionSummaryJobDto);
		const sentiment: number | null = await this.opinionService.getSentimentAverageForPolitician(opinionSummaryJob.politician);

		if (!sentiment) {
			return await this.updateJobStatus(opinionSummaryJob, JobStatus.Error);
		}

		const createOpinionSummaryDto: CreateOpinionSummaryDto = {
			politician: opinionSummaryJob.politician,
			sentiment,
		};

		await this.opinionSummaryService.insert(createOpinionSummaryDto);
		return await this.updateJobStatus(opinionSummaryJob, JobStatus.Completed);
	}

	private async updateJobStatus(opinionSummaryJob: OpinionSummaryJob, jobStatus: JobStatus) {
		opinionSummaryJob.status = jobStatus;
		await this.opinionSummaryJobService.update(opinionSummaryJob);
		return opinionSummaryJob;
	}
}