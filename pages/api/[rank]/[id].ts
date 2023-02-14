import { NextApiRequest, NextApiResponse } from 'next';
import { Id, Rank, Word } from '../../../types';
import getAllWords from '../../../middleware/getAllWords';

export default function personHandler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query } = req;
    const { rank, id } = query;
    const words = getAllWords(rank as Rank, id as Id);
    return res.status(200).json(words);
}
