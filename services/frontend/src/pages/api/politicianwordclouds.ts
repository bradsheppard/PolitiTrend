import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import PoliticianWordCloudDto from '../../apis/politician-word-cloud/PoliticianWordCloudDto'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<PoliticianWordCloudDto[]>
) {
    const axiosResponse = await axios.get<PoliticianWordCloudDto[]>(
        'http://analytics/politician-word-cloud',
        { params: req.query }
    )
    res.json(axiosResponse.data)
}
