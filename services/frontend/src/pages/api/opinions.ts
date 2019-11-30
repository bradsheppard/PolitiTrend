import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Opinion from '../../model/Opinion';

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    const axiosResponse = await axios.get<Array<Opinion>>('http://opinion');
    res.status(200).json(axiosResponse.data);
}