import SettingsIcon from '@mui/icons-material/Settings';
import React, { MouseEvent, useEffect, useState } from 'react';

import { Setting } from './Setting';

const SettingButton = () => {
    const [isSetting, setIsSetting] = useState<boolean>(false);
    useEffect(() => {
        const close = () => setIsSetting(false);
        window.addEventListener('click', () => {
            close();
        });
        return window.removeEventListener('click', close);
    });
    const handleSetting = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsSetting((prev) => !prev);
    };

    return (
        <div className="relative">
            <div className="cursor-pointer" onClick={handleSetting}>
                <SettingsIcon style={{ width: '3rem', height: '3rem' }} />
            </div>
            {isSetting && <Setting />}
        </div>
    );
};

export default SettingButton;
