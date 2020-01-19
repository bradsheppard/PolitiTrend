import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import TweetDto from '../../../apis/TweetDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<TweetDto[]>) {
	const tweetAxiosResponse = await axios.get<TweetDto[]>('http://opinion/tweet', {params: req.query});
	res.json(tweetAxiosResponse.data);
}
