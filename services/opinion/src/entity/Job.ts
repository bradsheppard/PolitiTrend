import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum JobStatus {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Completed = 'Completed'
}

export enum JobType {
    OpinionSummary = 'OpinionSummary'
}

@Entity()
export default class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: JobType,
        default: JobType.OpinionSummary
    })
    type: JobType;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.NotStarted
    })
    status: JobStatus;
}