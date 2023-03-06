import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Button from '@mui/material/Button';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import path from 'path';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import CountDown from '../../../../components/Scoring/CountDown';
import Result from '../../../../components/Scoring/Result';
import ShowWord from '../../../../components/Worker/ShowWord';
import WorkHeader from '../../../../components/Worker/WorkHeader';
import { pronounceVolumeContext } from '../../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../../Contexts/TypingVolumeProvider';
import useScoringWord from '../../../../hooks/useScoringWord';
import getAllWords from '../../../../middleware/getAllWords';
import type { PageProps, PathParam, PathParams } from '../../../../types';
import { pronounce, sliceByNumber, sound, stageLoadMap,typeSound } from '../../../../utils';

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
        wordDispatch({ type: 'init', payload: { words } });
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
                    <ShowWord
                        word={wordState.word}
                        typed={wordState.typed}
                        unTyped={wordState.unTyped}
                        showUnTyped={showUnTyped}
                        showHint={wordState.continueMissCount >= 3}
                        progress={`${wordState.index + 1} / ${wordState.words.length}`}
                    />
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
