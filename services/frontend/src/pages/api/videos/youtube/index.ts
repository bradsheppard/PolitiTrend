import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import YoutubeVideo from '../../../../apis/model/YoutubeVideo'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<YoutubeVideo[]>
): Promise<void> {
    const youtubeVideoAxiosResponse = await axios.get<YoutubeVideo[]>(`http://video/youtube`, {
        params: req.query,
    })
    res.json(youtubeVideoAxiosResponse.data)
}
