import React, { FC, Fragment } from 'react';
import { Id, Rank, Stage } from '../../types';
import Modal from './Modal';
import path from 'path';
import useGetWords from '../../hooks/useGetWords';
import Spinner from './Spinner';

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

export default StageWordsList;
