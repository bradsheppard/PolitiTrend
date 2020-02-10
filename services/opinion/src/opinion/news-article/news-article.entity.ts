import { Opinion } from '../opinion.entity';
import { ChildEntity, Column, Index, Unique } from 'typeorm';

@ChildEntity()
@Unique(['source'])
export default class NewsArticle extends Opinion {
	@Index()
	@Column()
	source: string;

	@Column()
	image: string;

	@Column()
	title: string;

	@Column()
	url: string;
}
