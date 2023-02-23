import React, { FC, Fragment } from 'react';
import { Loading, Word } from '../../types';
import Modal from './Modal';
import Spinner from './Spinner';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import IconButton from '@mui/material/IconButton';
import useFavorites from '../../hooks/useFavorites';
import { useAuthContext } from '../../Contexts/AuthProvider';

type Props = {
    isLoading: Loading;
    isOpen: boolean;
    words: Word[];
    close: () => void;
};

const WordsList: FC<Props> = ({ isLoading, isOpen, words, close }) => {
    const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
    const { user } = useAuthContext();
    return (
        <div>
            <Spinner isLoading={isLoading} />
            <Modal isOpen={isOpen} close={close}>
                <div className="h-full overflow-y-scroll">
                    {words.map((word, i) => {
                        return (
                            <Fragment key={i}>
                                <div className={`flex mx-2 py-2 items-center ${i % 2 === 0 && 'bg-gray-200'}`}>
                                    <div className="mr-4 ml-1">No.{word.id}</div>
                                    <div className="text-lg">{word.en}</div>
                                    <span className="ml-1 mr-2">:</span>
                                    <div className="text-lg whitespace-nowrap text-ellipsis overflow-x-hidden">
                                        {word.ja}
                                    </div>
                                    {user && (
                                        <div className="flex items-center justify-end flex-1">
                                            <IconButton
                                                sx={{ marginRight: '10px' }}
                                                aria-label="favorite"
                                                onClick={() => {
                                                    favorites.includes(word.id)
                                                        ? removeFromFavorites(word)
                                                        : addToFavorites(word);
                                                }}
                                            >
                                                {favorites.includes(word.id) ? <StarIcon /> : <StarBorderIcon />}
                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
};

export default WordsList;
