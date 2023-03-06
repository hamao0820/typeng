import { useEffect, useMemo, useState } from 'react';

import { useFavoritesContext } from '../Contexts/FavoritesProvider';
import { Word } from '../types';
import { shuffle } from '../utils';

const useFavoriteWords = (words: Word[]) => {
    const favorites = useFavoritesContext();
    const favoriteWords = useMemo(() => {
        return (favorites.map((id) => words.find((word) => word.id === id)).filter((v) => v) as Word[]).sort(
            (a, b) => a.id - b.id
        );
    }, [favorites, words]);
    const [randomWords, setRandomWords] = useState<Word[]>(shuffle(favoriteWords));
    const [word, setWord] = useState<Word | null>(randomWords.length > 0 ? randomWords[0] : null);
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const [missed, setMissed] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0); // challenge

    useEffect(() => {
        setMissCount(0);
    }, []);

    useEffect(() => {
        setRandomWords(shuffle(favoriteWords));
    }, [favoriteWords]);

    useEffect(() => {
        setWord(randomWords.length > 0 ? randomWords[0] : null);
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

    const handleWord = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
        const key = e.key;
        if (e.altKey || e.metaKey || e.ctrlKey || e.key === 'Enter') return;
        if (unTyped === undefined || unTyped == '') return;
        if (unTyped.startsWith(key)) {
            setMissCount(0);
            if (unTyped.length === 1) {
                setWord((preWord) => {
                    if (preWord) {
                        const preIndex = randomWords.findIndex((v) => v.id === preWord.id);
                        if (preIndex === -1) return randomWords.length > 0 ? randomWords[0] : null;
                        if (preIndex !== randomWords.length - 1) return randomWords[preIndex + 1];
                        setRandomWords((p) => {
                            if (p.length <= 1) return [...p];
                            while (true) {
                                const next = shuffle(p);
                                if (preWord.id !== next[0].id) return next;
                            }
                        });
                    }
                    return null;
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
    };

    return { favoriteWords, word, typed, unTyped, missed, missCount, handleWord };
};

export default useFavoriteWords;
