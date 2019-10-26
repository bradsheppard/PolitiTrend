import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    const response = await fetch('http://politician');
    const politicians = await response.json();

    res.status(200).json(politicians);
}