import { Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { OpinionSentiment } from './opinion-sentiment.entity';

@Entity()
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export abstract class Opinion {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => OpinionSentiment, sentiment => sentiment.opinion)
    sentiments: OpinionSentiment[];
}
