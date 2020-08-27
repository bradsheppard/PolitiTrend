import {
	Column,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	Unique,
	ValueTransformer,
} from 'typeorm';

export const dateTransformer: ValueTransformer = {
	from: (dbValue: Date) => {
		return dbValue.toUTCString();
	},
	to: (entityValue: string) => new Date(entityValue),
};

@Entity()
@Index('IDX_NEWS_ARTICLE_POLITICIANS', { synchronize: false })
@Unique(['url'])
export default class NewsArticle {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({type: 'timestamp', transformer: dateTransformer})
	dateTime: string;

	@Column({type: 'int', array: true })
	politicians: number[];

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

	@Column({nullable: true})
	summary: string;
}
