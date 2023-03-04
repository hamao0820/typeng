import { Reducer, useEffect, useReducer } from 'react';
import { ResultType, Word } from '../types';
import { shuffle } from '../utils';

type Action =
    | {
          type: 'typed';
          payload: { event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent };
      }
    | { type: 'init'; payload: { words: Word[] } };
type WordStateType = {
    words: Word[];
    word: Word | null;
    index: number;
    unTyped: string;
    typed: string;
    miss: boolean;
    continueMissCount: number;
    missCountSum: number;
    results: ResultType[];
};

const initialWordsState: WordStateType = {
    words: [],
    word: null,
    index: 0,
    unTyped: '',
    typed: '',
    miss: false,
    continueMissCount: 0,
    missCountSum: 0,
    results: [],
};

const reducer: Reducer<WordStateType, Action> = (state, action): WordStateType => {
    switch (action.type) {
        case 'typed': {
            const { words, word, index, unTyped, typed, continueMissCount, results, miss } = state;
            const { key, shiftKey } = action.payload.event;
            if (word === null) return state;
            // 単語が存在する

            if (word.en[0].toUpperCase() === unTyped[0] && !shiftKey) return state;
            // 文字の大小以外は正解

            if (!unTyped.startsWith(key)) {
                const continueMissCount = state.continueMissCount + 1;
                const missCountSum = state.missCountSum + 1;
                return { ...state, continueMissCount, missCountSum, miss: true };
            }
            // 文字の大小まで正解している

            if (unTyped.length !== 1)
                return { ...state, typed: typed + key, unTyped: unTyped.slice(1), continueMissCount: 0 };
            // 各単語を最後までうち終わった

            if (index !== words.length - 1) {
                const nextIndex = index + 1;
                const nextWord = words[nextIndex];
                return {
                    ...state,
                    index: nextIndex,
                    word: nextWord,
                    unTyped: nextWord.en,
                    typed: '',
                    continueMissCount: 0,
                    miss: false,
                    results: [...results, { ...word, correct: !miss }],
                };
            }
            // 全ての単語を打ち終わった

            return {
                ...state,
                typed: '',
                unTyped: '',
                word: null,
                index: 0,
                results: [...results, { ...word, correct: continueMissCount === 0 }],
            };
        }
        case 'init': {
            const index = 0;
            const words = shuffle(action.payload.words);
            const word = words[index];
            return word
                ? {
                      ...state,
                      words,
                      word,
                      index,
                      unTyped: word.en,
                      typed: '',
                      miss: false,
                      continueMissCount: 0,
                      missCountSum: 0,
                      results: [],
                  }
                : initialWordsState;
        }
    }
};

const useScoringWord = (words: Word[]) => {
    const [state, dispatch] = useReducer(reducer, initialWordsState);
    useEffect(() => {
        dispatch({ type: 'init', payload: { words } });
    }, [words]);
    return { state, dispatch };
};

export default useScoringWord;
