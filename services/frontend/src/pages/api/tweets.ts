import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Tweet from '../../apis/model/Tweet'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<Tweet[]>
): Promise<void> {
    const tweetAxiosResponse = await axios.get<Tweet[]>('http://tweet', { params: req.query })
    res.json(tweetAxiosResponse.data)
}
