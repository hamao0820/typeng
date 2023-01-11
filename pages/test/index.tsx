import React, { useEffect } from 'react';
import SelectList from '../../components/SelectList';
import Header from '../../components/Header';
import { pronounce } from '../practice/[rank]/[id]';
import Head from 'next/head';

const TestHome = () => {
    useEffect(() => {
        // speechSynthesisAPIを初期化
        pronounce('', 0);
    }, []);
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Head>
                <title>test</title>
            </Head>
            <Header text="モード選択に戻る" href="/" mode="test" />
            <div className="flex justify-center">
                <SelectList rank={1} wordsNum={956} mode={'test'} />
                <SelectList rank={2} wordsNum={882} mode={'test'} />
                <SelectList rank={3} wordsNum={1024} mode={'test'} />
                <SelectList rank={4} wordsNum={938} mode={'test'} />
            </div>
        </div>
    );
};

export default TestHome;
