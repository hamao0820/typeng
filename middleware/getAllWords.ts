import path from 'path';
import fs from 'fs';
import { sliceByNumber } from '../pages/practice/[rank]/[id]';
import { Id, Rank, Word } from '../types';

const getAllWords = (rank: Rank, id: Id): Word[] => {
    const dataDir = path.join(process.cwd(), 'public');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    const allWords = sliceByNumber(data, 100)[Number(id)];
    return allWords;
};

export default getAllWords;
