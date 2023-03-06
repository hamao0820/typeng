import { NextApiRequest, NextApiResponse } from 'next';

import getAllWords from '../../../../middleware/getAllWords';
import { Rank, Word, World } from '../../../../types';

export default function personHandler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query } = req;
    const { rank, world } = query as { rank: Rank; world: World };
    const words = getAllWords(rank, world);
    return res.status(200).json(words);
}
