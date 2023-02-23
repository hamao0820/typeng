import React, { FC, Fragment } from 'react';
import { Loading, Word } from '../../types';
import Modal from './Modal';
import Spinner from './Spinner';
import FavoriteStar from '../Favorites/FavoriteStar';

type Props = {
    isLoading: Loading;
    isOpen: boolean;
    words: Word[];
    close: () => void;
};

const WordsList: FC<Props> = ({ isLoading, isOpen, words, close }) => {
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
                                    <FavoriteStar word={word}></FavoriteStar>
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
