import { NextApiRequest, NextApiResponse } from 'next';
import { World, Rank, Word } from '../../../../types';
import getAllWords from '../../../../middleware/getAllWords';

export default function personHandler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query } = req;
    const { rank, id } = query as { rank: Rank; id: World };
    const words = getAllWords(rank, id);
    return res.status(200).json(words);
}
