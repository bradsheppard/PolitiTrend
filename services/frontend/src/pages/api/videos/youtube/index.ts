import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import YoutubeVideoDto from '../../../../apis/video/youtube/YoutubeVideoDto'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<YoutubeVideoDto[]>
): Promise<void> {
    const youtubeVideoAxiosResponse = await axios.get<YoutubeVideoDto[]>(`http://video/youtube`, {
        params: req.query,
    })
    res.json(youtubeVideoAxiosResponse.data)
}
