import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import NewsArticleDto from '../../apis/news-article/NewsArticleDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<NewsArticleDto[]>) {
    const tweetAxiosResponse = await axios.get<NewsArticleDto[]>('http://news-article', {params: req.query});
    res.json(tweetAxiosResponse.data);
}
