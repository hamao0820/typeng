import React, { createContext, ReactNode, useState } from 'react';

type Props = {
    children: ReactNode;
};

export const soundEffectVolumeContext = createContext<number>(10);
export const setSoundEffectVolumeContext = createContext<React.Dispatch<React.SetStateAction<number>>>(() => {});

const SoundEffectProvider: React.FC<Props> = ({ children }) => {
    const [soundEffectVolume, setSoundEffectVolume] = useState<number>(10);
    return (
        <soundEffectVolumeContext.Provider value={soundEffectVolume}>
            <setSoundEffectVolumeContext.Provider value={setSoundEffectVolume}>
                {children}
            </setSoundEffectVolumeContext.Provider>
        </soundEffectVolumeContext.Provider>
    );
};

export default SoundEffectProvider;
