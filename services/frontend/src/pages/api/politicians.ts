import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Politician from '../../model/Politician';

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    const axiosResponse = await axios.get<Array<Politician>>('http://politician');
    res.status(200).json(axiosResponse.data);
}