import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import SentimentDto from '../../apis/sentiment/SentimentDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<SentimentDto[]>) {
    const axiosResponse = await axios.get<SentimentDto[]>('http://analytics/sentiment', {params: req.query});
    res.json(axiosResponse.data);
}
