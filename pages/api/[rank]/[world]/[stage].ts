import { NextApiRequest, NextApiResponse } from 'next';

import getWords from '../../../../middleware/getWords';
import { PathParams, Word } from '../../../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query, method } = req;
    if (method !== 'GET') return res.end();
    const pathParams = query as PathParams;
    const words = getWords(pathParams);
    return res.status(200).json(words);
}
