import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import Politician from '../../../../model/Politician';
import Opinion from '../../../../model/Opinion';
import PoliticianOpinions from '../../../../model/PoliticianOpinions';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;

    const politicianInstance = axios.create({baseURL: 'http://politician'});
    const opinionInstance = axios.create({baseURL: 'http://opinion'});

    const [politician, opinions] = await Promise.all([
        politicianInstance.get<Politician>(`/${id}`),
        opinionInstance.get<Array<Opinion>>(`?politician=${id}`)
    ]);

    if(politician.status === 200 && opinions.status === 200) {
        const politicianJson: Politician = politician.data;
        const opinionsJson: Array<Opinion> = opinions.data;
        const politicianOpinions: PoliticianOpinions = {
            politician: politicianJson,
            opinions: opinionsJson
        };

        res.json(politicianOpinions);
    }
    else {
        res.status(404).end();
    }
}
