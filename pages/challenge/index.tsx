import React from 'react';
import SelectList from '../../components/SelectList';
import Header from '../../components/Header';
import Head from 'next/head';

const ChallengeHome = () => {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Head>
                <title>challenge</title>
            </Head>
            <Header text="モード選択に戻る" href="/" mode="challenge" />
            <div className="flex justify-center">
                <SelectList rank={'1'} wordsNum={956} mode={'challenge'} />
                <SelectList rank={'2'} wordsNum={882} mode={'challenge'} />
                <SelectList rank={'3'} wordsNum={1024} mode={'challenge'} />
                <SelectList rank={'4'} wordsNum={938} mode={'challenge'} />
            </div>
        </div>
    );
};

export default ChallengeHome;
