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
        <div className="flex w-full items-center justify-between">
            <BackButton href={href} text={text} hidden={true} />
            <div className="flex items-center">
                <RankSelect param={param} />
                <WorldSelect param={param} />
                <StageSelect param={param} />
                <ModeSelect param={param} />
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

export default WorkHeader;
