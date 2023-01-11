import React, { useEffect } from 'react';
import SelectList from '../../components/SelectList';
import Header from '../../components/Header';
import { pronounce } from '../practice/[rank]/[id]';
import Head from 'next/head';

const ScoringHome = () => {
    useEffect(() => {
        // speechSynthesisAPIを初期化
        pronounce('', 0);
    }, []);
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Head>
                <title>scoring</title>
            </Head>
            <Header text="モード選択に戻る" href="/" mode="scoring" />
            <div className="flex justify-center">
                <SelectList rank={1} wordsNum={956} mode={'scoring'} />
                <SelectList rank={2} wordsNum={882} mode={'scoring'} />
                <SelectList rank={3} wordsNum={1024} mode={'scoring'} />
                <SelectList rank={4} wordsNum={938} mode={'scoring'} />
            </div>
        </div>
    );
};

export default ScoringHome;
