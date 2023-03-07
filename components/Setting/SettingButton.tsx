import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState } from 'react';

import { Setting } from './Setting';

const SettingButton = () => {
    const [isSetting, setIsSetting] = useState<boolean>(false);
    const handleSetting = () => {
        setIsSetting((prev) => !prev);
        document.onclick = () => {
            setIsSetting(false);
        };
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
