// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import Word from '../practice/[rank]/[id]';

type Data = {
    words: Word[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    console.log(req);
    const { rank } = req.body as { rank: string };
    console.log(rank);
    const words = JSON.parse(fs.readFileSync(`../../data/rank${rank}.json`, 'utf-8'));
    res.status(200).json({ words });
}
