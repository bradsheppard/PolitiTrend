import SentimentDto from '../tweet/SentimentDto';

interface NewsArticleDto {
    id: number;
    image: string;
    title: string;
    url: string;
    source: string;
    description: string;
    sentiments: SentimentDto[];
}

export default NewsArticleDto;
