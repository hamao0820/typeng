import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { pronounce, sliceByNumber, sound, typeSound, stageLoadMap } from '../../../../utils';
import Head from 'next/head';
import getAllWords from '../../../../middleware/getAllWords';
import type { PageProps, PathParam, PathParams } from '../../../../types';
import path from 'path';
import useScoringWord from '../../../../hooks/useScoringWord';

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
    const words = useMemo(() => {
        const words_ = stage === 'all' ? allWords : sliceByNumber(allWords, 10)[Number(stage)];
        return words_ ? words_ : [];
    }, [allWords, stage]);
    const { state: wordState, dispatch: wordDispatch } = useScoringWord(words);
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [measures, setMeasures] = useState<PerformanceEntryList>([]);

    const initState = useCallback(() => {
        wordDispatch({ type: 'init', payload: { words: words } });
        setReady(false);
        setShowResult(false);
        setMeasures([]);
    }, [wordDispatch, words]);

    useEffect(() => initState(), [initState]);

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
        if (wordState.word) {
            const content = contentRef.current;
            content && setIsOver(800 <= content.clientWidth);
        }
        return () => {
            setShow(false);
        };
    }, [wordState.word]);

    useEffect(() => {
        if (ready && wordState.word) {
            pronounce(wordState.word.en, pronounceVolume / 100);
        }

        // pronounceVolumeを無視
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, wordState.word]);

    useEffect(() => {
        if (wordState.continueMissCount === 0) return;
        const body = ref.current;
        if (body === null) return;
        sound('sine', 0.1, soundEffectVolume / 100);
        body.animate([{ backgroundColor: 'rgba(200, 0, 0, 0.1)' }, { backgroundColor: '' }], {
            duration: 300,
            direction: 'alternate',
        });

        // soundEffectVolumeを無視
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordState.continueMissCount]);

    useEffect(() => {
        if (!ready) return;
        performance.mark('start');
    }, [ready]);

    useEffect(() => {
        if (wordState.words.length > 0 && wordState.words.length === wordState.results.length) {
            setShowResult(true);
        }
    }, [wordState.results, wordState.words]);

    useEffect(() => {
        const handleKeydown = (event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            typeSound(typingVolume / 100);
            wordDispatch({ type: 'typed', payload: { event } });
        };
        if (ready && !showResult) {
            window.addEventListener('keydown', handleKeydown);
        }
        if (ready && showResult) {
            performance.mark('end');
            performance.measure('measure', 'start', 'end');
            setMeasures(performance.getEntriesByName('measure'));
        }
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [ready, showResult, typingVolume, wordDispatch]);

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
                    {wordState.words && (
                        <div className="absolute top-5 right-10 text-3xl">
                            {wordState.index + 1} / {wordState.words.length}
                        </div>
                    )}
                    <div className="flex h-fit justify-start absolute top-1/3 left-60 w-full">
                        <div className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md">
                            <VolumeUpIcon
                                style={{ width: '13rem', height: '13rem' }}
                                onClick={() => {
                                    if (wordState.word === null) return;
                                    pronounce(wordState.word.en, pronounceVolume);
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
                                    {wordState.word && wordState.word.ja}
                                </span>
                            </div>
                            {wordState.word !== null && isOver && <Marquee content={wordState.word.ja} />}
                            <div className="whitespace-nowrap">
                                <span className="text-8xl font-bold whitespace-nowrap">
                                    {wordState.typed.replaceAll(' ', '␣')}
                                </span>
                                {wordState.continueMissCount >= 3 ? (
                                    <>
                                        <span className="text-8xl font-bold text-gray-300 whitespace-nowrap">
                                            {wordState.unTyped.replaceAll(' ', '␣')[0]}
                                        </span>
                                        <span
                                            className="text-8xl font-bold text-gray-300 whitespace-nowrap"
                                            style={show ? {} : { display: 'none' }}
                                        >
                                            {wordState.unTyped.replaceAll(' ', '␣').slice(1)}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className="text-8xl font-bold text-gray-300 whitespace-nowrap"
                                        style={show ? {} : { display: 'none' }}
                                    >
                                        {wordState.unTyped.replaceAll(' ', '␣')}
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
                        {wordState.word?.ja}
                    </span>
                </div>
            </div>
            {showResult && (
                <Result
                    missCount={wordState.missCountSum}
                    results={wordState.results}
                    measures={measures}
                    next={next}
                    retry={initState}
                />
            )}
        </>
    );
};

export default Scoring;
