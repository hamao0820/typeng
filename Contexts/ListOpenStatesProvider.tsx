import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';

import { ListOpenState, Rank,World } from '../types';
import { allRanks, sliceByNumber, wordsCounts } from '../utils';

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
            const rank = allRanks[i];
            return {
                rank: rank,
                openStates: sliceByNumber(
                    [...Array(wordsCount)].map((_, i) => i + 1),
                    100
                ).map<ListOpenState>((_, world) => {
                    return { world: String(world) as World, open: false };
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
