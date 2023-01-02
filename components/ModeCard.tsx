import Link from 'next/link';
import React from 'react';

type Props = {
    title: string;
    explanation: string;
    href: string;
};

const ModeCard: React.FC<Props> = ({ title, explanation, href }) => {
    return (
        <Link href={href}>
            <div className="w-80 h-40 border-2 border-solid border-blue-400 rounded-md flex flex-col items-center justify-evenly m-3 p-2 cursor-pointer bg-gray-50 hover:bg-blue-50">
                <div className="text-3xl font-bold">{title}</div>
                <div className="text-ml font-bold">{explanation}</div>
            </div>
        </Link>
    );
};

export default ModeCard;
