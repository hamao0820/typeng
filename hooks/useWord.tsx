import { useCallback, useEffect, useState } from 'react';
import { Stage, Word } from '../types';
import { shuffle, sliceByNumber } from '../utils';

const createIndices = (num: number) => {
    const serialIndices = [...Array(num)].map((_, i) => i);
    const shuffledIndices = shuffle(serialIndices);
    return shuffledIndices;
};

const useWord = (allWords: Word[], stage: Stage) => {
    const [word, setWord] = useState<Word>();
    const [words, setWords] = useState<Word[]>([]);
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const [missed, setMissed] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0); // challenge
    const [indices, setIndices] = useState<number[]>([]);
    const [index, setIndex] = useState<number>(-1);

    useEffect(() => {
        if (stage === 'all') {
            setWords((preWords) => (preWords.length === 0 ? allWords : preWords));
        } else {
            const words_ = sliceByNumber(allWords, 10)[Number(stage)];
            if (words_ !== undefined) {
                setWords((preWords) => (preWords.length === 0 ? shuffle(words_) : preWords));
            }
        }
        return () => {
            setMissCount(0);
            setWords([]);
        };
    }, [allWords, stage]);

    useEffect(() => {
        if (words.length !== 0) {
            setIndices(createIndices(words.length));
        }
        return () => setIndex(-1);
    }, [words]);

    useEffect(() => {
        if (indices.length !== 0) {
            setIndex(indices[0]);
        }

        return () => setIndex(-1);
    }, [indices]);

    useEffect(() => {
        // wordsが変わった時, cleanup関数でindexが-1になるため, indicesが変更されるまでは無視される.
        if (index === -1) return;
        setWords((words) => {
            setWord(words[index]);
            return words;
        });
    }, [index]);

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
            if (unTyped === undefined || unTyped == '') return;
            if (unTyped.startsWith(key)) {
                setMissCount(0);
                if (unTyped.length === 1) {
                    setIndex((preIndex) => {
                        if (indices.indexOf(preIndex) === indices.length - 1) {
                            setIndices((indices) => shuffle(indices));
                            return -1;
                        }
                        return indices[indices.indexOf(preIndex) + 1];
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
        [indices, unTyped]
    );

    return { word, words, typed, unTyped, missed, missCount, handleWord };
};

export default useWord;
