import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import PoliticianWordCloud from '../../apis/model/PoliticianWordCloud'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<PoliticianWordCloud[]>
): Promise<void> {
    const axiosResponse = await axios.get<PoliticianWordCloud[]>(
        'http://analytics/politician-word-cloud',
        { params: req.query }
    )
    res.json(axiosResponse.data)
}
