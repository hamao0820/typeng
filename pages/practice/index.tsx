import React, { useEffect } from 'react';
import SelectList from '../../components/SelectList';
import Header from '../../components/Header';
import { pronounce } from './[rank]/[id]';
import Head from 'next/head';

const PracticeHome = () => {
    useEffect(() => {
        // speechSynthesisAPIを初期化
        pronounce('', 0);
    }, []);
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Head>
                <title>practice</title>
            </Head>
            <Header text="モード選択に戻る" href="/" mode="practice" />
            <div className="flex justify-center">
                <SelectList rank={1} wordsNum={956} mode={'practice'} />
                <SelectList rank={2} wordsNum={882} mode={'practice'} />
                <SelectList rank={3} wordsNum={1024} mode={'practice'} />
                <SelectList rank={4} wordsNum={938} mode={'practice'} />
            </div>
        </div>
    );
};

export default PracticeHome;
