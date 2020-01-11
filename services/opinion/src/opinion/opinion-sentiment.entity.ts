import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Opinion } from './opinion.entity';

@Entity()
export class OpinionSentiment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    politician: number;

    @Column()
    sentiment: number;

    @ManyToOne(type => Opinion, opinion => opinion.sentiments)
    opinion: Opinion;
}
