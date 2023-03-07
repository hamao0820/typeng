import fs from 'fs';
import path from 'path';

import { PathParams, Word, WordsData } from '../types';
import { stageIdRange } from '../utils';

const getWords = (pathParams: PathParams) => {
    const dataDir = path.join(process.cwd(), 'public');
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'data.json'), 'utf-8')) as WordsData;
    const target = stageIdRange.find((v) => {
        const { rank, world, stage } = v.stage;
        const { rank: targetRank, world: targetWorld, stage: targetStage } = pathParams;
        return rank === targetRank && world == targetWorld && stage === targetStage;
    });
    if (!target) return [];
    const words = target.IDs.map((id) => data.words.find((word) => word.id === id)).filter((v) => v) as Word[];
    return words;
};

export default getWords;
