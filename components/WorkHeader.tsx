import React from 'react';
import BackButton from './BackButton';
import SettingButton from './SettingButton';
import ModeSelect from './ModeSelect';
import StageSelect from './StageSelect';

type Props = {
    text: string;
    href: string;
    param: PathParam;
};

export type PathParam = {
    mode: string;
    rank: string;
    id: string;
    stage: string;
};

const WorkHeader: React.FC<Props> = ({ text, href, param }) => {
    return (
        <div className="w-full flex justify-between items-center">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
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
