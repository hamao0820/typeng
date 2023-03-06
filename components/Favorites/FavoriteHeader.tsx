import { useRouter } from 'next/router';
import React from 'react';

import { Mode, Rank } from '../../types';
import BackButton from '../Header/BackButton';
import SettingButton from '../Setting/SettingButton';
import FavoriteModeSelect from './FavoriteModeSelect';
import FavoriteRankSelect from './FavoriteRankSelect';

type Props = {
    text: string;
    href: string;
    mode: Mode;
};

const FavoriteHeader: React.FC<Props> = ({ text, href, mode }) => {
    const router = useRouter();
    const { rank } = router.query as { rank: Rank };
    const a = { mode, rank };
    return (
        <div className="flex w-full items-center justify-between">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
                <FavoriteRankSelect mode={mode} rank={rank} />
                <FavoriteModeSelect mode={mode} rank={rank} />
                <div
                    className="relative m-2 flex items-center justify-center p-2"
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
