export class SearchNewsArticleDto {
	id?: number;
	politicians?: number[];
	limit?: number;
	offset?: number;
	source: string;
}
