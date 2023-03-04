import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../../components/Worker/Marquee';
import Button from '@mui/material/Button';
import CountDown from '../../../../components/Scoring/CountDown';
import Result from '../../../../components/Scoring/Result';
import WorkHeader from '../../../../components/Worker/WorkHeader';
import { pronounce, shuffle, sliceByNumber, sound, typeSound, stageLoadMap, createIndices } from '../../../../utils';
import Head from 'next/head';
import getAllWords from '../../../../middleware/getAllWords';
import type { PageProps, PathParam, PathParams, ResultType, Word } from '../../../../types';
import path from 'path';

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
    return {
        paths: stageLoadMap.map((v) => {
            return { params: v.stage };
        }),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
    const { rank, world, stage } = context.params as PathParams;
    const pathParam: PathParam = { mode: 'practice', rank, world, stage };
    const allWords = getAllWords(rank, world);
    return { props: { allWords, pathParam } };
};
const Scoring: NextPage<PageProps> = ({ allWords, pathParam }) => {
    const { stage } = pathParam;
    const words = useMemo(
        () => (stage === 'all' ? allWords : sliceByNumber(allWords, 10)[Number(stage)]),
        [allWords, stage]
    );
    const [randomWords, setRandomWords] = useState<Word[]>(words ? shuffle(words) : []);
    const [index, setIndex] = useState<number>(0);
    const word: Word | null = randomWords[index] ?? null;
    const [unTyped, setUnTyped] = useState<string>(word ? word.en : '');
    const [typed, setTyped] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const [results, setResults] = useState<ResultType[]>([]);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0);
    const [miss, setMiss] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [missCountSum, setMissCountSum] = useState<number>(0);
    const [measure, setMeasure] = useState<PerformanceEntryList>([]);

    const initState = () => {
        setResults([]);
        setIndex(0);
        setRandomWords((p) => shuffle(p));
        setReady(false);
        setShowResult(false);
        setMissCountSum(0);
        setMeasure([]);
    };

    const next = async () => {
        const target = stageLoadMap.find(
            (v) =>
                v.stage.world === pathParam.world &&
                v.stage.rank === pathParam.rank &&
                v.stage.stage === pathParam.stage
        );
        if (!target) return;
        const stageNo = target.stageNo;
        const nextStage = stageLoadMap.find((v) => v.stageNo === stageNo + 1);
        if (!nextStage) return;
        const { rank, world, stage } = nextStage.stage;
        if (stage === 'all') {
            await router.push({ pathname: `/${path.join('scoring', rank, world, stage)}` });
        } else {
            await router.push({ pathname: `/${path.join('practice', rank, world, stage)}` });
        }
    };

    useEffect(() => {
        if (word) {
            setUnTyped(word.en);
            const content = contentRef.current;
            content && setIsOver(800 <= content.clientWidth);
        }
        return () => {
            setShow(false);
            setTyped('');
            setMissCount(0);
            setMiss(false);
        };
    }, [word]);

    useEffect(() => {
        if (ready && word) {
            pronounce(word.en, pronounceVolume / 100);
        }
        // pronounceVolumeを無視
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, word]);

    useEffect(() => {
        if (!ready) return;
        performance.mark('start');
    }, [ready]);

    useEffect(() => {
        const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped === '') return;
            if (unTyped.startsWith(key)) {
                setMissCount(0);
                if (unTyped.length === 1) {
                    word && setResults((p) => [...p, { ...word, correct: !miss }]);
                    setIndex((p) => {
                        if (p === randomWords.length - 1) {
                            performance.mark('end');
                            performance.measure('measure', 'start', 'end');
                            setMeasure(performance.getEntriesByName('measure'));
                            setShowResult(true);
                            return -1;
                        }
                        return p + 1;
                    });
                    return;
                }
                typeSound(typingVolume / 100);
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
            } else {
                if (unTyped[0].toUpperCase() === unTyped[0] && e.shiftKey) {
                    return;
                }
                const body = ref.current;
                if (body === null) return;
                setMiss(true);
                setMissCount((prev) => prev + 1);
                setMissCountSum((prev) => prev + 1);
                sound('sine', 0.1, soundEffectVolume / 100);
                body.animate([{ backgroundColor: 'rgba(200, 0, 0, 0.1)' }, { backgroundColor: '' }], {
                    duration: 300,
                    direction: 'alternate',
                });
            }
        };
        if (ready && !showResult) {
            window.addEventListener('keydown', handleKeydown);
        }
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [miss, randomWords, ready, showResult, soundEffectVolume, typingVolume, unTyped, word]);

    return (
        <>
            <Head>
                <title>scoring</title>
            </Head>
            <div className="h-screen w-screen overflow-hidden" ref={ref}>
                {!ready && <CountDown setReady={setReady} />}
                <WorkHeader
                    text="選択画面に戻る"
                    href="/scoring"
                    param={{ mode: 'scoring', ...(router.query as any) }}
                />
                <div className="h-4/5 relative w-full">
                    {randomWords && (
                        <div className="absolute top-5 right-10 text-3xl">
                            {index + 1} / {randomWords.length}
                        </div>
                    )}
                    <div className="flex h-fit justify-start absolute top-1/3 left-60 w-full">
                        <div className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md">
                            <VolumeUpIcon
                                style={{ width: '13rem', height: '13rem' }}
                                onClick={() => {
                                    if (word === null) return;
                                    pronounce(word.en, pronounceVolume);
                                }}
                            />
                            <div className="absolute left-60 top-80">
                                <Button
                                    variant="outlined"
                                    endIcon={<LightbulbIcon style={{ width: '1.5rem', height: '1.5rem' }} />}
                                    style={{ width: '224px', padding: '8px' }}
                                    onClick={() => setShow(true)}
                                >
                                    <span className="text-lg">答えを見る</span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between ml-5" style={{ width: '800px' }}>
                            <div className={isOver ? 'hidden' : ''}>
                                <span className="text-7xl font-bold whitespace-nowrap h-fit max-w-4xl overflow-hidden text-ellipsis inline-block">
                                    {word && word.ja}
                                </span>
                            </div>
                            {word !== null && isOver && <Marquee content={word.ja} />}
                            <div className="whitespace-nowrap">
                                <span className="text-8xl font-bold whitespace-nowrap">
                                    {typed.replaceAll(' ', '␣')}
                                </span>
                                {missCount >= 3 ? (
                                    <>
                                        <span className="text-8xl font-bold text-gray-300 whitespace-nowrap">
                                            {unTyped.replaceAll(' ', '␣')[0]}
                                        </span>
                                        <span
                                            className="text-8xl font-bold text-gray-300 whitespace-nowrap"
                                            style={show ? {} : { display: 'none' }}
                                        >
                                            {unTyped.replaceAll(' ', '␣').slice(1)}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className="text-8xl font-bold text-gray-300 whitespace-nowrap"
                                        style={show ? {} : { display: 'none' }}
                                    >
                                        {unTyped.replaceAll(' ', '␣')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="invisible">
                    <span
                        className="text-7xl font-bold whitespace-nowrap h-fit max-w-4xl overflow-hidden text-ellipsis inline-block"
                        ref={contentRef}
                    >
                        {word?.ja}
                    </span>
                </div>
            </div>
            {showResult && (
                <Result missCount={missCountSum} results={results} measure={measure} next={next} retry={initState} />
            )}
        </>
    );
};

export default Scoring;
