import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;

    const response = await fetch(`http://politician/${id}`);

    if(response.status === 200) {
        const politician = await response.json();
        res.status(200).json(politician);
    }
    else {
        res.status(404).end();
    }
}