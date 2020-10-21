import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import TweetDto from '../../apis/tweet/TweetDto'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<TweetDto[]>
): Promise<void> {
    const tweetAxiosResponse = await axios.get<TweetDto[]>('http://tweet', { params: req.query })
    res.json(tweetAxiosResponse.data)
}
