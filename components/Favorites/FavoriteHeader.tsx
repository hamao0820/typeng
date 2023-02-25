import React from 'react';
import BackButton from '../Header/BackButton';
import SettingButton from '../Setting/SettingButton';
import FavoriteModeSelect from './FavoriteModeSelect';
import { useRouter } from 'next/router';
import { Mode, Rank } from '../../types';

type Props = {
    text: string;
    href: string;
    mode: Mode;
};

const FavoriteHeader: React.FC<Props> = ({ text, href, mode }) => {
    const router = useRouter();
    const { rank } = router.query as { rank: Rank };
    return (
        <div className="w-full flex justify-between items-center">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
                <FavoriteModeSelect mode={mode} rank={rank} />
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
