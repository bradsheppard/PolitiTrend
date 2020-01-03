import { JobStatus } from '../opinion-summary-job.entity';

export class UpdateOpinionSummaryJobDto {
	id: number;
	status: JobStatus;
	politician: number;
	opinionSummary: number;
}
