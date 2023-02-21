import Head from 'next/head';
import React, { FC } from 'react';
import Header from '../Header/Header';
import useListOpenStates from '../../hooks/useListOpenStates';
import { Id, Mode, Rank } from '../../types';
import SelectList from './SelectList';
import { wordsCounts } from '../../utils';

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
                {wordsCounts.map((count, i) => {
                    const rank = String(i + 1) as Rank;
                    const target = openStates.find((state) => state.rank === rank);
                    if (target === undefined) return;
                    return (
                        <SelectList
                            key={i}
                            rank={rank}
                            wordsNum={count}
                            mode={mode}
                            openStates={target.openStates}
                            handleClick={(id: Id) => handleClick(rank, id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default StageSelection;
