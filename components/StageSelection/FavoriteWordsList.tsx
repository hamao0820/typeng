import React, { FC } from 'react';
import { Rank, Word } from '../../types';
import WordsList from './WordsList';
import useGetWords from '../../hooks/useGetWords';
import path from 'path';
import { useFavoritesContext } from '../../Contexts/FavoritesProvider';
import { rankIndicesObj } from '../../utils';

type Props = {
    rank: Rank;
    isOpen: boolean;
    close: () => void;
};

const FavoriteWordsList: FC<Props> = ({ rank, isOpen, close }) => {
    const { words, isLoading } = useGetWords(isOpen, path.join('api', rank));
    const favorites = useFavoritesContext();
    const allIndices = rankIndicesObj.find((v) => v.rank === rank)?.indices;
    if (allIndices === undefined) return <></>;
    const indices = favorites.filter((id) => allIndices.includes(id));
    const favoriteWords = (indices.map((id) => words.find((word) => word.id === id)).filter((v) => v) as Word[]).sort(
        (a, b) => a.id - b.id
    );
    return (
        <WordsList isLoading={isLoading} isOpen={isLoading === 'done' && isOpen} words={favoriteWords} close={close} />
    );
};

export default FavoriteWordsList;
