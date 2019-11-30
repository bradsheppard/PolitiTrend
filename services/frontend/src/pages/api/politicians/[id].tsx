import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Politician from '../../../model/Politician';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;
    const axiosResponse = await axios.get<Politician>(`http://politician/${id}`);

    if(axiosResponse.status === 200)
        res.status(200).json(axiosResponse.data);
    else
        res.status(404).end();
}