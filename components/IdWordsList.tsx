import React, { Fragment, useEffect, useState } from 'react';
import Modal from './Modal';
import { Id, Rank, Word } from '../types';

type Props = {
    rank: Rank;
    id: Id | '';
    isOpen: boolean;
    close: () => void;
};

const IdWordsList: React.FC<Props> = ({ rank, id, isOpen, close }) => {
    const [words, setWords] = useState<Word[]>([]);
    useEffect(() => {
        if (id === '') return;
        (async () => {
            const res = await fetch(`api/${rank}/${id}`);
            const words = (await res.json()) as Word[];
            setWords(words);
        })();
    }, [rank, id]);
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

export default IdWordsList;
