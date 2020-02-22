import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import NewsArticle from '../news-article/news-article.entity';

@Entity()
export class Sentiment {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column()
	politician: number;

	@Column({ type: 'double precision' })
	value: number;

	@Index()
	@ManyToOne(() => NewsArticle, newsArticle => newsArticle.sentiments, { onDelete: 'CASCADE'})
	newsArticle: NewsArticle;
}
