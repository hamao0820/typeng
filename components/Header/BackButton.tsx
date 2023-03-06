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
                <div className="flex items-center m-2">
                    <div className="p-2 bg-blue-300 w-fit rounded-md">
                        <ArrowBackIcon style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    <span className="text-xl font-bold ml-5">{text}</span>
                </div>
            </Link>
        </div>
    );
};

export default BackButton;
