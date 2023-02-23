import React, { FC } from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import IconButton from '@mui/material/IconButton';
import useFavorites from '../../hooks/useFavorites';
import { useAuthContext } from '../../Contexts/AuthProvider';
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
                        {favorites.includes(word.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                </div>
            )}
        </>
    );
};

export default FavoriteStar;
