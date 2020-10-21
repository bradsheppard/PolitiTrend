import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import StatePartyAffiliationDto from '../../apis/state-party-affiliation/StatePartyAffiliationDto'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<StatePartyAffiliationDto[]>
) {
    const axiosResponse = await axios.get<StatePartyAffiliationDto[]>(
        'http://analytics/state-party-affiliation',
        { params: req.query }
    )
    res.json(axiosResponse.data)
}
