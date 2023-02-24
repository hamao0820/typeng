import React from 'react';
import BackButton from '../Header/BackButton';
import SettingButton from '../Setting/SettingButton';

type Props = {
    text: string;
    href: string;
};

const FavoriteHeader: React.FC<Props> = ({ text, href }) => {
    return (
        <div className="w-full flex justify-between items-center">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
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
        </div>
    );
};

export default FavoriteHeader;
