import React, { ReactNode, createContext, useState } from 'react';

type Props = {
    children: ReactNode;
};

export const typingVolumeContext = createContext<number>(100);
export const setTypingVolumeContext = createContext<React.Dispatch<React.SetStateAction<number>>>(() => {});

const TypingVolumeProvider: React.FC<Props> = ({ children }) => {
    const [typingVolume, setTypingVolume] = useState<number>(30);
    return (
        <typingVolumeContext.Provider value={typingVolume}>
            <setTypingVolumeContext.Provider value={setTypingVolume}>{children}</setTypingVolumeContext.Provider>
        </typingVolumeContext.Provider>
    );
};

export default TypingVolumeProvider;
