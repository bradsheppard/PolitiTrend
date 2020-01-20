import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, TableInheritance, ValueTransformer } from 'typeorm';
import { Sentiment } from '../sentiment/sentiment.entity';

export const dateTransformer: ValueTransformer = {
	from: (dbValue: Date) => {
		return dbValue.toUTCString();
	},
	to: (entityValue: string) => new Date(entityValue),
};

@Entity()
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export abstract class Opinion {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({type: 'timestamp', transformer: dateTransformer})
	dateTime: string;

	@OneToMany(type => Sentiment, sentiment => sentiment.opinion, {cascade: true, eager: true})
	sentiments: Sentiment[];
}
