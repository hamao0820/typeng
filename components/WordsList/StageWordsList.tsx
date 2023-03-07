import path from 'path';
import React, { FC } from 'react';

import useGetWords from '../../hooks/useGetWords';
import { Rank, Stage, World } from '../../types';
import WordsList from './WordsList';

type Props = {
    rank: Rank;
    world: World | '';
    stage: Stage | '';
    isOpen: boolean;
    close: () => void;
};

const StageWordsList: FC<Props> = ({ rank, world, stage, isOpen, close }) => {
    const skipCondition = world === '' || stage === '';
    const { words, isLoading } = useGetWords(isOpen, path.join('api', rank, world, stage), skipCondition, 150);

    return <WordsList isLoading={isLoading} isOpen={isLoading === 'done' && isOpen} words={words} close={close} />;
};

export default StageWordsList;
