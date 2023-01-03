import React from 'react';
import SelectList from '../../components/SelectList';
import Header from '../../components/Header';

const Practice = () => {
    `●RANK 1　TOEFL iBT61点前後までの単語（956語）
     ●RANK 2　TOEFL iBT80点前後までの単語（882語）
     ●RANK 3　TOEFL iBT100点前後までの単語（1024語）
     ●RANK 4　TOEFL iBT105点を超える単語（938語）`;
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
