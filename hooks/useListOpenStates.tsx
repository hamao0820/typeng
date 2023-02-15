import { useState } from 'react';
import { sliceByNumber } from '../utils';
import { Id, ListOpenState, Rank } from '../types';

type RankListOpenState = {
    rank: Rank;
    openStates: ListOpenState[];
};

const useListOpenStates = (wordsCounts: number[]) => {
    const [openStates, setOpenStates] = useState<RankListOpenState[]>(
        wordsCounts.map((wordsCount, i) => {
            const rank = String(i + 1) as Rank;
            return {
                rank: rank,
                openStates: sliceByNumber(
                    [...Array(wordsCount)].map((_, i) => i + 1),
                    100
                ).map<ListOpenState>((_, id) => {
                    return { id: String(id) as Id, open: false };
                }),
            };
        })
    );

    const handleClick = (rank: Rank, id: Id) => {
        setOpenStates((prev) => {
            const target = prev.find((state) => state.rank === rank);
            if (target === undefined) return prev;
            const newStates: ListOpenState[] = target.openStates.map((state, i) => {
                if (String(i) !== id) {
                    return { ...state, open: state.open };
                } else {
                    return { ...state, open: !state.open };
                }
            });
            return prev.map((state) => (state.rank === rank ? { rank, openStates: newStates } : state));
        });
    };

    const collapseAll = () => {
        setOpenStates((prev) =>
            prev.map((state) => {
                return {
                    ...state,
                    openStates: state.openStates.map((state) => {
                        return { ...state, open: false };
                    }),
                };
            })
        );
    };

    return { openStates, handleClick, collapseAll };
};
export default useListOpenStates;
