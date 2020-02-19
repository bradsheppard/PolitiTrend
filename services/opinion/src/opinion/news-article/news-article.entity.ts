import { Opinion } from '../opinion.entity';
import { ChildEntity, Column, Index, Unique } from 'typeorm';

@ChildEntity()
@Unique(['url'])
export default class NewsArticle extends Opinion {
	@Index()
	@Column()
	url: string;

	@Column()
	image: string;

	@Column()
	title: string;
}
