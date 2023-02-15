import React, { Dispatch, FC, ReactNode, SetStateAction, createContext, useState } from 'react';
import { Id, ListOpenState, Rank } from '../types';
import { sliceByNumber, wordsCounts } from '../utils';

type Props = {
    children: ReactNode;
};

type RankListOpenState = {
    rank: Rank;
    openStates: ListOpenState[];
};

export const openStatesContext = createContext<RankListOpenState[]>([]);
export const setOpenStatesContext = createContext<Dispatch<SetStateAction<RankListOpenState[]>>>(() => {});

const ListOpenStatesProvider: FC<Props> = ({ children }) => {
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

    return (
        <openStatesContext.Provider value={openStates}>
            <setOpenStatesContext.Provider value={setOpenStates}>{children}</setOpenStatesContext.Provider>
        </openStatesContext.Provider>
    );
};

export default ListOpenStatesProvider;
