import React, { Dispatch, SetStateAction } from 'react';

type Word = {
    id: number;
    en: string;
    ja: string;
};

type Props = {
    missCount: number;
    words: Word[];
};

const Result: React.FC<Props> = ({ missCount, words }) => {
    const allWordCount = words.map<number>((word) => word.en.length).reduce((p, c) => p + c);
    const correctTypeRate = (allWordCount - missCount) / allWordCount;
    return (
        <div className="h-screen w-screen absolute top-0 left-0 bg-white z-50 flex flex-col justify-center items-center">
            {JSON.stringify({missCount, allWordCount, correctTypeRate})}
        </div>
    );
};

export default Result;
