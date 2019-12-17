import Job from './Job';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export default class OpinionSummaryJob extends Job {
    @Index()
    @Column()
    politician: number;
}
