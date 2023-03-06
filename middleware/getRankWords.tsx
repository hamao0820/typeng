import fs from 'fs';
import path from 'path';

import { Rank, Word } from '../types';

const getRankWords = (rank: Rank): Word[] => {
    const dataDir = path.join(process.cwd(), 'public');
    const rankWords = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    return rankWords;
};

export default getRankWords;
