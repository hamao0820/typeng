import { NextApiRequest, NextApiResponse } from 'next';

import { getRankWords } from '../../../middleware/getWords';
import { Rank, Word } from '../../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query, method } = req;
    if (method !== 'GET') return res.end();
    const { rank } = query as { rank: Rank };
    const words = getRankWords(rank);
    return res.status(200).json(words);
}
