import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import React, { FC } from 'react';

import { useAuthContext } from '../../Contexts/AuthProvider';
import useFavorites from '../../hooks/useFavorites';
import { Word } from '../../types';

type Props = { word: Word };

const FavoriteStar: FC<Props> = ({ word }) => {
    const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
    const { user } = useAuthContext();
    return (
        <>
            {user && (
                <div className="flex items-center justify-end">
                    <IconButton
                        sx={{ marginRight: '10px' }}
                        aria-label="favorite"
                        onClick={() => {
                            favorites.includes(word.id) ? removeFromFavorites(word) : addToFavorites(word);
                        }}
                    >
                        {favorites.includes(word.id) ? <StarIcon style={{ color: '#1d4ed8' }} /> : <StarBorderIcon />}
                    </IconButton>
                </div>
            )}
        </>
    );
};

export default FavoriteStar;
