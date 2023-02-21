import React from 'react';
import BackButton from '../Header/BackButton';
import SettingButton from '../Setting/SettingButton';
import ModeSelect from '../Select/ModeSelect';
import StageSelect from '../Select/StageSelect';
import type { PathParam } from '../../types';
import IdSelect from '../Select/IdSelect';
import RankSelect from '../Select/RankSelect';

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
                <IdSelect param={param} />
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
