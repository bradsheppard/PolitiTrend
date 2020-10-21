import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import GlobalWordCloudDto from '../../apis/global-word-cloud/GlobalWordCloudDto'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<GlobalWordCloudDto[]>
): Promise<void> {
    const axiosResponse = await axios.get<GlobalWordCloudDto[]>(
        'http://analytics/global-word-cloud',
        { params: req.query }
    )
    res.json(axiosResponse.data)
}
