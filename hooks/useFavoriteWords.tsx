import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFavoritesContext } from '../Contexts/FavoritesProvider';
import { Word } from '../types';
import { createIndices, shuffle } from '../utils';

const useFavoriteWords = (words: Word[]) => {
    const favorites = useFavoritesContext();
    const [word, setWord] = useState<Word>();
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const [missed, setMissed] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0); // challenge
    const [indices, setIndices] = useState<number[]>([]);
    const [index, setIndex] = useState<number>(-1);
    const favoriteWords = useMemo(() => {
        return (favorites.map((id) => words.find((word) => word.id === id)).filter((v) => v) as Word[]).sort(
            (a, b) => a.id - b.id
        );
    }, [favorites, words]);

    useEffect(() => {
        setMissCount(0);
    }, []);

    useEffect(() => {
        console.log(favoriteWords);
        if (favoriteWords.length !== 0) {
            setIndices(createIndices(favoriteWords.length));
        }
        return () => setIndex(-1);
    }, [favoriteWords]);

    useEffect(() => {
        if (indices.length !== 0) {
            setIndex(indices[0]);
        }
        return () => setIndex(-1);
    }, [indices]);

    useEffect(() => {
        // wordsが変わった時, cleanup関数でindexが-1になるため, indicesが変更されるまでは無視される.
        if (index === -1) return;
        setWord(favoriteWords[index]);
    }, [index, favoriteWords]);

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
                    if (indices.length === 1) {
                        setWord((preWord) => {
                            return { ...preWord! };
                        });
                        return;
                    }
                    setIndex((preIndex) => {
                        if (indices.indexOf(preIndex) === indices.length - 1) {
                            setIndices((indices) => {
                                while (true) {
                                    const nextIndices = shuffle(indices);
                                    if (nextIndices[0] !== preIndex) return nextIndices;
                                }
                            });
                            return -1;
                        }
                        return indices[indices.indexOf(preIndex) + 1] !== undefined
                            ? indices[indices.indexOf(preIndex) + 1]
                            : -1;
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
    return { favoriteWords, word, typed, unTyped, missed, missCount, handleWord };
};

export default useFavoriteWords;
