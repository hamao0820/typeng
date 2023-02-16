import React from 'react';
import BackButton from './BackButton';
import SettingButton from './SettingButton';
import ModeSelect from './ModeSelect';
import StageSelect from './StageSelect';
import type { PathParam } from '../types';
import IdSelect from './IdSelect';

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
