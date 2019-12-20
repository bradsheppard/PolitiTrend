import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum JobStatus {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Error = 'Error'
}

@Entity()
export default abstract class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.NotStarted
    })
    status: JobStatus;
}

