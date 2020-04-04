import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import PoliticianDto from '../../../apis/politician/PoliticianDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<PoliticianDto>) {
    const { query: { id } } = req;
    const politicianAxiosResponse = await axios.get<PoliticianDto>(`http://politician/${id}`);
    res.json(politicianAxiosResponse.data);
}
