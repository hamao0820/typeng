import React, { FC, Fragment, useEffect, useState } from 'react';
import { Id, Rank, Stage, Word } from '../types';
import Modal from './Modal';

type Props = {
    rank: Rank;
    id: Id | '';
    stage: Stage | '';
    isOpen: boolean;
    close: () => void;
};

const StageWordsList: FC<Props> = ({ rank, id, stage, isOpen, close }) => {
    const [words, setWords] = useState<Word[]>([]);
    useEffect(() => {
        if (id === '' || stage === '') return;
        (async () => {
            const res = await fetch(`api/${rank}/${id}/${stage}`);
            const words = (await res.json()) as Word[];
            setWords(words);
        })();
    }, [rank, id, stage]);
    return (
        <div>
            <Modal isOpen={isOpen} close={close}>
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
