import React from 'react';

import type { PathParam } from '../../types';
import BackButton from '../Header/BackButton';
import ModeSelect from '../Select/ModeSelect';
import RankSelect from '../Select/RankSelect';
import StageSelect from '../Select/StageSelect';
import WorldSelect from '../Select/WorldSelect';
import SettingButton from '../Setting/SettingButton';

type Props = {
    text: string;
    href: string;
    param: PathParam;
};

const WorkHeader: React.FC<Props> = ({ text, href, param }) => {
    return (
        <div className="w-full flex justify-between items-center">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
                <RankSelect param={param} />
                <WorldSelect param={param} />
                <StageSelect param={param} />
                <ModeSelect param={param} />
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

export default WorkHeader;
