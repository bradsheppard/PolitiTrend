import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import PoliticianSentiment from '../../apis/model/PoliticianSentiment'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<PoliticianSentiment[]>
): Promise<void> {
    req.query.minSampleSize = '200'
    req.query.resample = '86400000'

    const start = new Date()
    start.setDate(start.getDate() - 2)

    if (!req.query.start) req.query.start = start.toISOString()

    const axiosResponse = await axios.get<PoliticianSentiment[]>(
        'http://analytics/politician-sentiment',
        {
            params: req.query,
        }
    )
    res.json(axiosResponse.data)
}
