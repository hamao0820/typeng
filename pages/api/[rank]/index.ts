import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { Word } from '../../../types';

export default function personHandler(req: NextApiRequest, res: NextApiResponse<Word[]>) {
    const { query } = req;
    const { rank } = query;
    const dataDir = path.join(process.cwd(), 'public');
    const words = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    return res.status(200).json(words);
}
