import { NextApiRequest, NextApiResponse } from 'next';

import { getWorldWords } from '../../../../middleware/getWords';
import { Rank, Word, World } from '../../../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query, method } = req;
    if (method !== 'GET') return res.end();
    const { rank, world } = query as { rank: Rank; world: World };
    const words = getWorldWords(rank, world);
    return res.status(200).json(words);
}
