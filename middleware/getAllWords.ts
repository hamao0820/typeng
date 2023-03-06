import fs from 'fs';
import path from 'path';

import { Rank, Word,World } from '../types';
import { sliceByNumber } from '../utils';

const getAllWords = (rank: Rank, world: World): Word[] => {
    const dataDir = path.join(process.cwd(), 'public');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    const allWords = sliceByNumber(data, 100)[Number(world)];
    return allWords;
};

export default getAllWords;
