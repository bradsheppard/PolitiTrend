import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import WordCloudDto from '../../apis/word-cloud/WordCloudDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<WordCloudDto[]>) {
    const axiosResponse = await axios.get<WordCloudDto[]>('http://analytics/global-word-cloud', {params: req.query});
    res.json(axiosResponse.data);
}
