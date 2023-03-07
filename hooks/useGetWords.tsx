import { useEffect, useState } from 'react';

import { Loading, Word } from '../types';

const useGetWords = (isOpen: boolean, path: string, skipCondition?: boolean, time: number = 30) => {
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState<Loading>('hold');

    const getWords = async () => {
        const res = await fetch(path, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=86400' },
            cache: 'force-cache',
        });
        const words = (await res.json()) as Word[];
        return words;
    };

    const init = async () => {
        setIsLoading('loading');
        const words = await getWords();
        setWords(words);
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), time);
        });
        setIsLoading('done');
    };

    useEffect(() => {
        if (!skipCondition && isOpen) init();
        return () => setIsLoading('hold');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return { words, isLoading };
};

export default useGetWords;
