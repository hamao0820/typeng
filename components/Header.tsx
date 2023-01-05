import Link from 'next/link';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingButton from './SettingButton';

type Props = {
    text: string;
    href: string;
};

const Header: React.FC<Props> = ({ text, href }) => {
    return (
        <div className="w-full flex justify-between items-center">
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
            <div
                className="flex justify-center items-center m-2 p-2 relative"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <SettingButton />
            </div>
        </div>
    );
};

export default Header;
