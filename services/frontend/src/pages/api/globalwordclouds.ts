import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import GlobalWordCloud from '../../apis/model/GlobalWordCloud'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<GlobalWordCloud[]>
): Promise<void> {
    const axiosResponse = await axios.get<GlobalWordCloud[]>('http://analytics/global-word-cloud', {
        params: req.query,
    })
    res.json(axiosResponse.data)
}
