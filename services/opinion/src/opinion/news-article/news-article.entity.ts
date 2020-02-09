import { Opinion } from '../opinion.entity';
import { ChildEntity, Unique } from 'typeorm';

@ChildEntity()
@Unique(['source'])
export default class NewsActicle extends Opinion {
	source: string;
	image: string;
	title: string;
	url: string;
}
