import React, { createContext, ReactNode, useState } from 'react';

type Props = {
    children: ReactNode;
};

export const pronounceVolumeContext = createContext<number>(100);
export const setPronounceVolumeContext = createContext<React.Dispatch<React.SetStateAction<number>>>(() => {});

const PronounceProvider: React.FC<Props> = ({ children }) => {
    const [pronounceVolume, setPronounceVolume] = useState<number>(100);
    return (
        <pronounceVolumeContext.Provider value={pronounceVolume}>
            <setPronounceVolumeContext.Provider value={setPronounceVolume}>
                {children}
            </setPronounceVolumeContext.Provider>
        </pronounceVolumeContext.Provider>
    );
};

export default PronounceProvider;
