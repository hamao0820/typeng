import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../../Contexts/TypingVolumeProvider';
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
    const [showUnTyped, setShowUnTyped] = useState<boolean>(false);
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
        setShowUnTyped(false);
    }, [wordState.word]);

    useEffect(() => {
        if (ready && wordState.word) {
            pronounce(wordState.word.en, pronounceVolume / 100);
        }

        // pronounceVolumeを無視
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, wordState.word]);

    useEffect(() => {
        switch (wordState.typeState) {
            case 'correct': {
                typeSound(typingVolume / 100);
                wordDispatch({ type: 'typing-init' });
                return;
            }
            case 'incorrect': {
                const body = ref.current;
                if (body === null) return;
                sound('sine', 0.1, soundEffectVolume / 100);
                body.animate([{ backgroundColor: 'rgba(200, 0, 0, 0.1)' }, { backgroundColor: '' }], {
                    duration: 300,
                    direction: 'alternate',
                });
                wordDispatch({
                    type: 'typing-init',
                });
                return;
            }
            default:
                return;
        }
    }, [soundEffectVolume, typingVolume, wordDispatch, wordState.typeState]);

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
                <div className="flex flex-col">
                    <WorkHeader
                        text="選択画面に戻る"
                        href="/scoring"
                        param={{ mode: 'scoring', ...(router.query as any) }}
                    />
                    <div className="flex-1">
                        <div className="w-screen h-full">
                            <div className="flex justify-between items-center w-32 ml-auto mr-20 my-6">
                                <div className="text-5xl whitespace-nowrap">
                                    {wordState.index + 1} / {wordState.words.length}
                                </div>
                            </div>
                            <div className="flex h-fit justify-start w-full ml-3 mt-16">
                                <div
                                    className="w-fit h-fit flex items-center justify-center bg-green-500 rounded-md"
                                    onClick={() => {
                                        if (wordState.word === null) return;
                                        pronounce(wordState.word.en, pronounceVolume);
                                    }}
                                >
                                    <VolumeUpIcon
                                        sx={{ height: '40vh', width: '40vh', minHeight: '200px', minWidth: '200px' }}
                                    />
                                </div>
                                <div className="flex flex-col justify-between mx-2 flex-1">
                                    <div className="line-clamp-2">
                                        <div
                                            className="text-8xl font-bold line-clamp-2 tracking-tighter"
                                            style={{ lineHeight: '100px' }}
                                        >
                                            {wordState.word && wordState.word.ja}
                                        </div>
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <span className="text-7xl font-bold whitespace-nowrap">
                                            {wordState.typed.replaceAll(' ', '␣')}
                                        </span>
                                        {showUnTyped ? (
                                            <span className="text-7xl font-bold text-gray-300 whitespace-nowrap">
                                                {wordState.unTyped.replaceAll(' ', '␣')}
                                            </span>
                                        ) : (
                                            <>
                                                {wordState.continueMissCount >= 3 ? (
                                                    <>
                                                        <span className="text-7xl font-bold text-gray-300 whitespace-nowrap">
                                                            {wordState.unTyped.replaceAll(' ', '␣')[0]}
                                                        </span>
                                                        <span
                                                            className="text-7xl font-bold text-gray-300 whitespace-nowrap"
                                                            style={{ display: 'none' }}
                                                        >
                                                            {wordState.unTyped.replaceAll(' ', '␣').slice(1)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span
                                                        className="text-7xl font-bold text-gray-300 whitespace-nowrap"
                                                        style={{ display: 'none' }}
                                                    >
                                                        {wordState.unTyped.replaceAll(' ', '␣')}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-screen flex justify-center mt-5">
                    <Button
                        variant="outlined"
                        endIcon={<LightbulbIcon style={{ width: '1.5rem', height: '1.5rem' }} />}
                        style={{ width: '224px', padding: '8px' }}
                        onClick={() => setShowUnTyped(true)}
                    >
                        <span className="text-lg">答えを見る</span>
                    </Button>
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
