import path from 'path';
import fs from 'fs';
import { Word, sliceByNumber } from '../pages/practice/[rank]/[id]';

type Rank = '1' | '2' | '3' | '4';
type Id = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

const getAllWords = (rank: Rank, id: Id): Word[] => {
    const dataDir = path.join(process.cwd(), 'public');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    const allWords = sliceByNumber(data, 100)[Number(id)];
    return allWords;
};

export default getAllWords;
