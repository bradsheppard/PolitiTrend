import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(_req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({'response': 'pong'});
}