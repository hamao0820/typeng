import React, { FC } from 'react';
import { World, Rank } from '../../types';
import useGetWords from '../../hooks/useGetWords';
import path from 'path';
import WordsList from './WordsList';

type Props = {
    rank: Rank;
    world: World | '';
    isOpen: boolean;
    close: () => void;
};

const WorldWordsList: FC<Props> = ({ rank, world, isOpen, close }) => {
    const skipCondition = world === '';
    const { words, isLoading } = useGetWords(isOpen, path.join('api', rank, world), skipCondition, 150);
    return <WordsList isLoading={isLoading} isOpen={isLoading === 'done' && isOpen} words={words} close={close} />;
};

export default WorldWordsList;
