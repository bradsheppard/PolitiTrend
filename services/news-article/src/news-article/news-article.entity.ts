import {
	Column,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	ValueTransformer,
} from 'typeorm';
import { Sentiment } from '../sentiment/sentiment.entity';

export const dateTransformer: ValueTransformer = {
	from: (dbValue: Date) => {
		return dbValue.toUTCString();
	},
	to: (entityValue: string) => new Date(entityValue),
};

@Entity()
@Unique(['url'])
export default class NewsArticle {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({type: 'timestamp', transformer: dateTransformer})
	dateTime: string;

	@OneToMany(() => Sentiment, sentiment => sentiment.newsArticle, {cascade: true, eager: true})
	sentiments: Sentiment[];

	@Index()
	@Column()
	url: string;

	@Column()
	image: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	source: string;
}
