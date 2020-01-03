import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum JobStatus {
	NotStarted = 'NotStarted',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Error = 'Error',
}

@Entity()
export default class OpinionSummaryJob {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: JobStatus,
		default: JobStatus.NotStarted,
	})
	status: JobStatus;

	@Index()
	@Column()
	politician: number;

	@Column({nullable: true})
	opinionSummary: number;
}
