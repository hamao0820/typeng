import { useContext } from 'react';

import { openStatesContext, setOpenStatesContext } from '../Contexts/ListOpenStatesProvider';
import { ListOpenState, Rank,World } from '../types';

const useListOpenStates = () => {
    const openStates = useContext(openStatesContext);
    const setOpenStates = useContext(setOpenStatesContext);

    const handleClick = (rank: Rank, world: World) => {
        setOpenStates((prev) => {
            const target = prev.find((state) => state.rank === rank);
            if (target === undefined) return prev;
            const newStates: ListOpenState[] = target.openStates.map((state, i) => {
                if (String(i) !== world) {
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
