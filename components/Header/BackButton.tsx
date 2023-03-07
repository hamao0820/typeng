import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import React from 'react';

type Props = {
    text: string;
    href: string;
};

const BackButton: React.FC<Props> = ({ text, href }) => {
    return (
        <div className="w-fit">
            <Link href={href}>
                <div className="m-2 flex items-center">
                    <div className="w-fit rounded-md bg-blue-300 p-2">
                        <ArrowBackIcon style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    <span className="ml-5 flex whitespace-nowrap text-xl font-bold">{text}</span>
                </div>
            </Link>
        </div>
    );
};

export default BackButton;
