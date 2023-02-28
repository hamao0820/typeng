import React, { FC } from 'react';
import { World, Rank } from '../../types';
import useGetWords from '../../hooks/useGetWords';
import path from 'path';
import WordsList from './WordsList';

type Props = {
    rank: Rank;
    id: World | '';
    isOpen: boolean;
    close: () => void;
};

const IdWordsList: FC<Props> = ({ rank, id, isOpen, close }) => {
    const skipCondition = id === '';
    const { words, isLoading } = useGetWords(isOpen, path.join('api', rank, id), skipCondition, 150);
    return <WordsList isLoading={isLoading} isOpen={isLoading === 'done' && isOpen} words={words} close={close} />;
};

export default IdWordsList;
