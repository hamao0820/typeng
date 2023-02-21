import React, { Fragment } from 'react';
import Modal from './Modal';
import { Id, Rank } from '../../types';
import useGetWords from '../../hooks/useGetWords';
import path from 'path';
import Spinner from './Spinner';

type Props = {
    rank: Rank;
    id: Id | '';
    isOpen: boolean;
    close: () => void;
};

const IdWordsList: React.FC<Props> = ({ rank, id, isOpen, close }) => {
    const skipCondition = id === '';
    const { words, isLoading } = useGetWords(isOpen, path.join('api', rank, id), skipCondition, 150);
    return (
        <div>
            <Spinner isLoading={isLoading} />
            <Modal isOpen={isLoading === 'done' && isOpen} close={close}>
                <div className="h-full overflow-y-scroll">
                    {words.map((word, i) => {
                        return (
                            <Fragment key={i}>
                                <div className={`flex mx-2 py-2 items-center ${i % 2 === 0 && 'bg-gray-200'}`}>
                                    <div className="mr-4 ml-1">No.{Number(word.id) + 1}</div>
                                    <div className="text-lg">{word.en}</div>
                                    <span className="ml-1 mr-2">:</span>
                                    <div className="text-lg whitespace-nowrap text-ellipsis overflow-x-hidden">
                                        {word.ja}
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
};

export default IdWordsList;
