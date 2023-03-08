import { useCallback, useEffect, useState } from 'react';

import type { Word } from '../types';
import { shuffle } from '../utils';

const useWord = (words: Word[]) => {
    const [word, setWord] = useState<Word | null>(null);
    const [randomWords, setRandomWords] = useState<Word[]>(shuffle(words));
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const [missed, setMissed] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0); // challenge

    useEffect(() => setRandomWords(shuffle(words)), [words]);

    useEffect(() => {
        if (randomWords.length > 0) setWord(randomWords[0]);
    }, [randomWords]);

    useEffect(() => {
        if (word) {
            setUnTyped(word.en);
        }
        return () => {
            setMissed(false);
            setTyped('');
        };
    }, [word]);

    const handleWord = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (e.altKey || e.metaKey || e.ctrlKey || e.key === 'Enter' || e.key === 'Escape') return;
            if (unTyped === undefined || unTyped == '') return;
            if (unTyped.startsWith(key)) {
                setMissCount(0);
                if (unTyped.length === 1) {
                    setWord((preWord) => {
                        if (preWord === null) return preWord;
                        const preIndex = randomWords.findIndex((v) => v.id === preWord.id);
                        if (preIndex === -1) return randomWords[0];
                        if (preIndex === randomWords.length - 1) {
                            setRandomWords((preWords) => shuffle(preWords));
                            return null;
                        }
                        return randomWords[preIndex + 1];
                    });
                    return;
                }
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
            } else {
                if (unTyped[0].toUpperCase() === unTyped[0] && e.shiftKey) {
                    return;
                }
                setMissCount((prev) => prev + 1);
                setMissed(true);
            }
        },
        [randomWords, unTyped]
    );

    return { word, typed, unTyped, missed, missCount, handleWord };
};

export default useWord;
