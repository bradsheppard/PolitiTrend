import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export default class OpinionSummary {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    politician: number;

    @Column()
    sentiment: number;
}
