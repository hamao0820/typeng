import { NextApiRequest, NextApiResponse } from 'next';

import getAllWords from '../../../../middleware/getAllWords';
import { Rank, Stage, Word, World } from '../../../../types';
import { sliceByNumber } from '../../../../utils';

export default function personHandler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query } = req;
    const { rank, world, stage } = query as { rank: Rank; world: World; stage: Stage };
    const allWords = getAllWords(rank, world);
    if (stage === 'all') return res.status(200).json(allWords);
    const words = sliceByNumber(allWords, 10)[Number(stage)];
    return res.status(200).json(words);
}
