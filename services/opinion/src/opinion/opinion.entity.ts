import { Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { Sentiment } from '../sentiment/sentiment.entity';

@Entity()
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export abstract class Opinion {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(type => Sentiment, sentiment => sentiment.opinion, {cascade: true, eager: true})
	sentiments: Sentiment[];
}
