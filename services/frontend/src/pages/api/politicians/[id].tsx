import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import PoliticianDto from '../../../apis/PoliticianDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<PoliticianDto>) {
    const { query: { id } } = req;
    const politicianAxiosResponse = await axios.get<PoliticianDto>(`http://politician/${id}`, {params: req.query});
    res.json(politicianAxiosResponse.data);
}
