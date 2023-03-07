import Head from 'next/head';
import React, { FC } from 'react';

import useListOpenStates from '../../hooks/useListOpenStates';
import { Mode, World } from '../../types';
import { allRanks } from '../../utils';
import Header from '../Header/Header';
import SelectList from './SelectList';

type Props = {
    mode: Mode;
};

const StageSelection: FC<Props> = ({ mode }) => {
    const { openStates, handleClick, collapseAll } = useListOpenStates();
    return (
        <div className="flex h-screen min-w-fit flex-col">
            <Head>
                <title>{mode}</title>
                <link rel="shortcut icon" href="favicons/favicon.ico" />
            </Head>
            <Header text="モード選択に戻る" href="/" mode={mode} collapseAll={collapseAll} />
            <div className="flex flex-1 justify-center">
                {allRanks.map((rank, i) => {
                    const target = openStates.find((state) => state.rank === rank);
                    if (target === undefined) return;
                    return (
                        <SelectList
                            key={i}
                            rank={rank}
                            mode={mode}
                            openStates={target.openStates}
                            handleClick={(world: World) => handleClick(rank, world)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default StageSelection;
