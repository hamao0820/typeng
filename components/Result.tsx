import React from 'react';
import { ResultType } from '../pages/scoring/[rank]/[id]';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Header from './Header';

type Props = {
    missCount: number;
    results: ResultType[];
    measure: PerformanceEntryList;
};

const Result: React.FC<Props> = ({ missCount, results, measure }) => {
    const allWordCount = results.map<number>((result) => result.en.length).reduce((p, c) => p + c);
    const correctTypeRate = Math.round(((allWordCount - missCount) / allWordCount) * 100);
    const router = useRouter();
    return (
        <div className="h-screen w-screen absolute top-0 left-0 bg-white z-50 flex flex-col items-center overflow-hidden">
            <Header text="ステージ選択に戻る" href="/scoring" />
            <div className="h-4/5 w-5/6 flex flex-1">
                <div className="h-full flex-1 m-1 overflow-hidden">
                    <div className="text-center text-xl font-bold">単語</div>
                    <div className="h-full overflow-y-scroll pb-6 scrollbar-hide">
                        {results.map((result) => {
                            return (
                                <React.Fragment key={result.id}>
                                    <div className="border-b-2 border-solid border-gray-300 p-1 my-2">
                                        <div className="text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                                            {result.ja}
                                        </div>
                                        <div
                                            className={
                                                result.correct ? 'text-lg font-bold' : 'text-red-500 font-bold text-lg'
                                            }
                                        >
                                            {result.en}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 m-1">
                    <div className="text-center text-xl font-bold">結果</div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">正答率</div>
                        <div className="text-5xl font-bold">
                            {results.filter((result) => result.correct).length} / {results.length}
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">タイム</div>
                        <div className="text-5xl font-bold">{Math.round(measure[0].duration) / 1000} 秒</div>
                    </div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">入力速度(文字/秒)</div>
                        <div className="text-5xl font-bold">
                            {Math.round((allWordCount / measure[0].duration) * 1000 * 100) / 100}
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">ミスタッチ</div>
                        <div className="text-5xl font-bold">{missCount}</div>
                    </div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">正確率</div>
                        <div className="text-5xl font-bold">{correctTypeRate} %</div>
                    </div>
                    <div className="relative">
                        <Button
                            variant="outlined"
                            onClick={() => router.reload()}
                            sx={{ position: 'absolute', top: '20px', right: '0' }}
                        >
                            retry
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
