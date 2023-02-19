import { useCallback, useEffect, useState } from 'react';
import { Stage, Word } from '../types';
import { shuffle, sliceByNumber } from '../utils';

const useWord = (allWords: Word[], stage: Stage) => {
    const [word, setWord] = useState<Word>();
    const [words, setWords] = useState<Word[]>([]);
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const [missed, setMissed] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0); // challenge
    const [indices, setIndices] = useState<number[]>([]);

    useEffect(() => {
        setMissCount(0);
        if (stage === 'all') {
            setWords((preWords) => (preWords.length === 0 ? allWords : preWords));
        } else {
            const words_ = sliceByNumber(allWords, 10)[Number(stage)];
            if (words_ !== undefined) {
                setWords((preWords) => (preWords.length === 0 ? shuffle(words_) : preWords));
            }
        }
        return () => {
            setWords([]);
        };
    }, [allWords, stage]);

    useEffect(() => {
        if (word === undefined) {
            return;
        }
        setMissed(false);
        setUnTyped(word.en);
        setTyped('');
    }, [word]);

    const handleWord = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped === undefined) return;
            if (unTyped.startsWith(key)) {
                setMissCount(0);
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
        [unTyped]
    );

    useEffect(() => {
        if (words === undefined || words.length === 0) return;
        if (word === undefined || word.en === typed) {
            setIndices((prev) => prev.slice(1));
            return;
        }
    }, [typed, word, words]);

    useEffect(() => {
        if (words === undefined || words.length === 0) {
            return;
        }
        if (indices.length === 0) {
            const serialIndices = [...Array(words.length)].map((_, i) => i);
            if (word === undefined) {
                setIndices(shuffle(serialIndices));
                return;
            }
            let indices_ = shuffle(serialIndices);
            while (indices_[0] === words.indexOf(word)) {
                indices_ = shuffle(serialIndices);
            }
            setIndices(indices_);
            return;
        }
        setWord(words[indices[0]]);
    }, [indices, word, words]);

    return { word, words, typed, unTyped, missed, missCount, handleWord };
};

export default useWord;
