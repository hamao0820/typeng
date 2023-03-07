import InfoIcon from '@mui/icons-material/Info';
import React, { MouseEvent, useState } from 'react';

import Information from './Information';

const InformationButton = () => {
    const [show, setShow] = useState<boolean>(false);

    const handleSetting = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShow((prev) => !prev);
        const close = () => setShow(false);
        window.addEventListener('click', close, { once: true });
    };
    return (
        <div className="relative">
            <div className="cursor-pointer" onClick={handleSetting}>
                <InfoIcon style={{ width: '3rem', height: '3rem' }} />
            </div>
            {show && <Information />}
        </div>
    );
};

export default InformationButton;
