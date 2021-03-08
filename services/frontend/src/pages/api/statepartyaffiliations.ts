import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import StatePartyAffiliationDto from '../../apis/state-party-affiliation/StatePartyAffiliationDto'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<StatePartyAffiliationDto[]>
): Promise<void> {
    req.query.minSampleSize = '100'
    req.query.resample = '86400000'

    const start = new Date()
    start.setDate(start.getDate() - 1)

    if (!req.query.start) req.query.start = start.toISOString()

    const axiosResponse = await axios.get<StatePartyAffiliationDto[]>(
        'http://analytics/state-party-affiliation',
        { params: req.query }
    )
    res.json(axiosResponse.data)
}
