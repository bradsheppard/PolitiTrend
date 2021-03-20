import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Politician from '../../../apis/model/Politician'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<Politician[]>
): Promise<void> {
    const politicianAxiosResponse = await axios.get<Politician[]>(`http://politician`, {
        params: req.query,
    })
    res.json(politicianAxiosResponse.data)
}
