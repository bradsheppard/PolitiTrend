import { Column, Entity, Index } from 'typeorm';
import Job from './Job';

@Entity()
export default class OpinionSummaryJob extends Job {
    @Index()
    @Column()
    politician: number;

    @Column()
    opinionSummary: number;
}
