import React, { useEffect } from 'react';
import SelectList from '../../components/SelectList';
import Header from '../../components/Header';
import { pronounce } from './[rank]/[id]';

const Practice = () => {
    useEffect(() => {
        // speechSynthesisAPIを初期化
        pronounce('', 0);
    }, []);
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Header text="モード選択に戻る" href="/" />
            <div className="flex justify-center">
                <SelectList rank={1} wordsNum={956} />
                <SelectList rank={2} wordsNum={882} />
                <SelectList rank={3} wordsNum={1024} />
                <SelectList rank={4} wordsNum={938} />
            </div>
        </div>
    );
};

export default Practice;
