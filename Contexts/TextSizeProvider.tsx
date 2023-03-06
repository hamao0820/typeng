import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';

import { TextSize } from '../types';

type Props = {
    children: ReactNode;
};

const textSizeContext = createContext<TextSize>('large');
const setTextSizeContext = createContext<Dispatch<SetStateAction<TextSize>>>(() => {});

const TextSizeProvider: FC<Props> = ({ children }) => {
    const [textSize, setTextSize] = useState<TextSize>('large');
    return (
        <textSizeContext.Provider value={textSize}>
            <setTextSizeContext.Provider value={setTextSize}>{children}</setTextSizeContext.Provider>
        </textSizeContext.Provider>
    );
};
export const useTextSizeContext = () => ({
    textSize: useContext(textSizeContext),
    setTextSize: useContext(setTextSizeContext),
});

export default TextSizeProvider;
