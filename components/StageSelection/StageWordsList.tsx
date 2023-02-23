import React, { FC } from 'react';
import { Id, Rank, Stage } from '../../types';
import path from 'path';
import useGetWords from '../../hooks/useGetWords';
import WordsList from './WordsList';

type Props = {
    rank: Rank;
    id: Id | '';
    stage: Stage | '';
    isOpen: boolean;
    close: () => void;
};

const StageWordsList: FC<Props> = ({ rank, id, stage, isOpen, close }) => {
    const skipCondition = id === '' || stage === '';
    const { words, isLoading } = useGetWords(isOpen, path.join('api', rank, id, stage), skipCondition, 150);

    return <WordsList isLoading={isLoading} isOpen={isLoading === 'done' && isOpen} words={words} close={close} />;
};

export default StageWordsList;
