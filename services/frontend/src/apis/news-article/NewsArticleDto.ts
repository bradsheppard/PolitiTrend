interface NewsArticleDto {
    id: number;
    image: string;
    title: string;
    url: string;
    source: string;
    summary: string;
    dateTime: string;
    politicians: number[];
}

export default NewsArticleDto;
