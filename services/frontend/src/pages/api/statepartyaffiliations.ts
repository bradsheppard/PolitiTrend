import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import StatePartyAffiliation from '../../apis/model/StatePartyAffiliation'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<StatePartyAffiliation[]>
): Promise<void> {
    req.query.minSampleSize = '100'
    req.query.resample = '86400000'

    const start = new Date()
    start.setDate(start.getDate() - 1)

    if (!req.query.start) req.query.start = start.toISOString()

    const axiosResponse = await axios.get<StatePartyAffiliation[]>(
        'http://analytics/state-party-affiliation',
        { params: req.query }
    )
    res.json(axiosResponse.data)
}
