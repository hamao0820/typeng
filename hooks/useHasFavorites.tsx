import React, { useMemo } from 'react';
import { useFavoritesContext } from '../Contexts/FavoritesProvider';
import { Rank } from '../types';
import { rankIndicesObj } from '../utils';

const useHasFavorites = (rank: Rank) => {
    const favorites = useFavoritesContext();
    const hasFavorite = useMemo(
        () =>
            favorites.find((id) => rankIndicesObj.filter((v) => v.rank === rank)[0].indices.includes(id)) !== undefined,
        [favorites, rank]
    );
    return hasFavorite;
};

export default useHasFavorites;
