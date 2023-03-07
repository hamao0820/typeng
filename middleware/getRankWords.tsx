import fs from 'fs';
import path from 'path';

import { Rank, Word, WordsData } from '../types';
import { rankIndicesObj } from '../utils';

const getRankWords = (rank: Rank): Word[] => {
    const dataDir = path.join(process.cwd(), 'public');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'data.json'), 'utf-8')) as WordsData;
    const target = rankIndicesObj.find((v) => v.rank === rank);
    if (!target) return [];
    const rankWords = target.indices.map((id) => data.words.find((word) => word.id === id)).filter((v) => v) as Word[];
    return rankWords;
};

export default getRankWords;
