import fs from 'fs';
import path from 'path';

import { PathParams, Rank, Word, WordsData, World } from '../types';
import { rankIndicesObj, stageIdRange } from '../utils';

const dataDir = path.join(process.cwd(), 'public');
const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'data.json'), 'utf-8')) as WordsData;

const getWords = (pathParams: PathParams) => {
    const target = stageIdRange.find((v) => {
        const { rank, world, stage } = v.stage;
        const { rank: targetRank, world: targetWorld, stage: targetStage } = pathParams;
        return rank === targetRank && world == targetWorld && stage === targetStage;
    });
    if (!target) return [];
    const words = target.IDs.map((id) => data.words.find((word) => word.id === id)).filter((v) => v) as Word[];
    return words;
};

export const getWorldWords = (rank: Rank, world: World) => {
    const target = stageIdRange.find((v) => rank === v.stage.rank && world == v.stage.world && v.stage.stage === 'all');
    if (!target) return [];
    const words = target.IDs.map((id) => data.words.find((word) => word.id === id)).filter((v) => v) as Word[];
    return words;
};

export const getRankWords = (rank: Rank): Word[] => {
    const target = rankIndicesObj.find((v) => v.rank === rank);
    if (!target) return [];
    const rankWords = target.indices.map((id) => data.words.find((word) => word.id === id)).filter((v) => v) as Word[];
    return rankWords;
};

export default getWords;
