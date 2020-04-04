interface NewsArticleDto {
    id: number;
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
    politicians: number[];
}

export default NewsArticleDto;
