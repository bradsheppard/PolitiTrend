import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import OpinionSummaryDto from '../../../apis/opinion-summary/OpinionSummaryDto';

export default async function handle(req: NextApiRequest, res: NextApiResponse<OpinionSummaryDto[]>) {
	const opinionSummaryAxiosResponse = await axios.get<OpinionSummaryDto[]>('http://opinion/opinionsummary', {params: req.query});
	res.json(opinionSummaryAxiosResponse.data);
}
