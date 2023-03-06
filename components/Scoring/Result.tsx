import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { pronounceVolumeContext } from '../../Contexts/PronounceProvider';
import type { ResultType } from '../../types';
import { pronounce } from '../../utils';
import FavoriteStar from '../Favorites/FavoriteStar';
import WorkHeader from '../Worker/WorkHeader';

type Props = {
    missCount: number;
    results: ResultType[];
    measures: PerformanceEntryList;
    next: () => void;
    retry: () => void;
};

const Result: React.FC<Props> = ({ missCount, results, measures, next, retry }) => {
    const allWordCount = results.map<number>((result) => result.en.length).reduce((p, c) => p + c, 0);
    const correctTypeRate = Math.round(((allWordCount - missCount) / (allWordCount + missCount)) * 100);
    const router = useRouter();
    const pronounceVolume = useContext(pronounceVolumeContext);
    const measure = measures[0];
    const duration = measure ? measure.duration : 1;
    return (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-screen flex-col items-center overflow-hidden bg-white">
            <WorkHeader
                text="ステージ選択に戻る"
                href="/scoring"
                param={{ mode: 'scoring', ...(router.query as any) }}
            ></WorkHeader>
            <div className="flex h-4/5 w-5/6 flex-1">
                <div className="m-1 h-full flex-1 overflow-hidden">
                    <div className="text-center text-xl font-bold">単語</div>
                    <div className="h-full overflow-y-scroll pb-6 scrollbar-hide">
                        {results.map((result) => {
                            return (
                                <React.Fragment key={result.id}>
                                    <div className="my-2 flex items-end border-b-2 border-solid border-gray-300 p-1">
                                        <div
                                            className="flex h-fit w-fit items-center justify-center rounded-md bg-green-400 p-1"
                                            onClick={() => {
                                                pronounce(result.en, pronounceVolume);
                                            }}
                                        >
                                            <VolumeUpIcon style={{ width: '2.5rem', height: '2.5rem' }} />
                                        </div>
                                        <div className="mx-2">
                                            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                                                {result.ja}
                                            </div>
                                            <div
                                                className={
                                                    result.correct
                                                        ? 'text-lg font-bold'
                                                        : 'text-lg font-bold text-red-500'
                                                }
                                            >
                                                {result.en}
                                            </div>
                                        </div>
                                        <div className="flex-1 items-center">
                                            <div className="justify-self-end">
                                                <FavoriteStar word={{ id: result.id, ja: result.ja, en: result.en }} />
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                <div className="m-1 flex flex-1 flex-col">
                    <div className="text-center text-xl font-bold">結果</div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">正答率</div>
                        <div className="text-5xl font-bold">
                            {results.filter((result) => result.correct).length} / {results.length}
                        </div>
                    </div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">タイム</div>
                        <div className="text-5xl font-bold">{Math.round(duration) / 1000} 秒</div>
                    </div>
                    <div className="flex items-end justify-between border-b-2 border-solid border-gray-300 p-3">
                        <div className="text-lg font-bold">入力速度(文字/秒)</div>
                        <div className="text-5xl font-bold">
                            {Math.round((allWordCount / duration) * 1000 * 100) / 100}
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
                    <div className="flex justify-between">
                        <Button variant="outlined" onClick={retry} sx={{ margin: '20px 5px' }}>
                            retry
                        </Button>
                        <Button variant="outlined" onClick={next} sx={{ margin: '20px 5px' }}>
                            next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
