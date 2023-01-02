import React from 'react';

type Props = {
    title: string;
    explanation: string;
};

const ModeCard: React.FC<Props> = ({ title, explanation }) => {
    return (
        <div className="w-80 h-40 border-2 border-solid border-blue-400 rounded-md flex flex-col items-center justify-evenly m-3 p-2 cursor-pointer bg-gray-50 hover:bg-blue-50">
            <div className="text-3xl font-bold">{title}</div>
            <div className="text-ml font-bold">{explanation}</div>
        </div>
    );
};

export default ModeCard;
