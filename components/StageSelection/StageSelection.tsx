import Head from 'next/head';
import React, { FC } from 'react';
import Header from '../Header/Header';
import useListOpenStates from '../../hooks/useListOpenStates';
import { World, Mode } from '../../types';
import SelectList from './SelectList';
import { allRanks } from '../../utils';

type Props = {
    mode: Mode;
};

const StageSelection: FC<Props> = ({ mode }) => {
    const { openStates, handleClick, collapseAll } = useListOpenStates();
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Head>
                <title>{mode}</title>
                <link rel="shortcut icon" href="favicons/favicon.ico" />
            </Head>
            <Header text="モード選択に戻る" href="/" mode={mode} collapseAll={collapseAll} />
            <div className="flex justify-center">
                {allRanks.map((rank, i) => {
                    const target = openStates.find((state) => state.rank === rank);
                    if (target === undefined) return;
                    return (
                        <SelectList
                            key={i}
                            rank={rank}
                            mode={mode}
                            openStates={target.openStates}
                            handleClick={(id: World) => handleClick(rank, id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default StageSelection;
