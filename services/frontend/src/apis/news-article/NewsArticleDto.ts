import SentimentDto from '../tweet/SentimentDto';

interface NewsArticleDto {
    id: number;
    image: string;
    title: string;
    url: string;
    sentiments: SentimentDto[];
}

export default NewsArticleDto;
