import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Button from '@mui/material/Button';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import FavoriteCountDown from '../../../components/Favorites/FavoriteCountDown';
import FavoriteHeader from '../../../components/Favorites/FavoriteHeader';
import FavoriteResult from '../../../components/Favorites/FavoriteResult';
import ShowWord from '../../../components/Worker/ShowWord';
import { useFavoritesContext } from '../../../Contexts/FavoritesProvider';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import useScoringWord from '../../../hooks/useScoringWord';
import getRankWords from '../../../middleware/getRankWords';
import type { PathParams, Word } from '../../../types';
import { FavoritesPageProps } from '../../../types/favorite';
import { pronounce, sound, typeSound } from '../../../utils';

export const getServerSideProps: GetServerSideProps<FavoritesPageProps> = async (context) => {
    const { rank } = context.params as PathParams;
    const rankWords = getRankWords(rank);
    return { props: { rankWords } };
};

const Favorites: NextPage<FavoritesPageProps> = ({ rankWords }) => {
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const [showUnTyped, setShowUnTyped] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [measures, setMeasures] = useState<PerformanceEntryList>([]);
    const favorites = useFavoritesContext();
    const favoriteWords = useMemo(() => {
        return (favorites.map((id) => rankWords.find((word) => word.id === id)).filter((v) => v) as Word[]).sort(
            (a, b) => a.id - b.id
        );
    }, [favorites, rankWords]);
    const { state: wordState, dispatch: wordDispatch } = useScoringWord([]);

    useEffect(() => {
        if (!showResult) {
            wordDispatch({ type: 'init', payload: { words: favoriteWords } });
        }
    }, [favoriteWords, showResult, wordDispatch]);

    const initState = useCallback(() => {
        wordDispatch({ type: 'init', payload: { words: favoriteWords } });
        setReady(false);
        setShowResult(false);
        setMeasures([]);
    }, [favoriteWords, wordDispatch]);

    const retry = useCallback(async () => {
        if (favoriteWords.length === 0) {
            if (confirm('おめでとうございます!!\n苦手な単語がなくなりました!!\nステージ選択ページに移動しますか?')) {
                await router.push({ pathname: '/scoring' });
            }
        } else {
            initState();
        }
    }, [favoriteWords.length, initState, router]);

    const back = useCallback(async () => {
        if (confirm('ステージ選択ページに移動しますか?')) {
            router.push({ pathname: '/scoring' });
        }
    }, [router]);

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
                {!ready && <FavoriteCountDown setReady={setReady} />}
                <div className="flex flex-col">
                    <FavoriteHeader text="選択画面に戻る" href="/scoring" mode="scoring" />
                    <ShowWord
                        {...{
                            word: wordState.word,
                            unTyped: wordState.unTyped,
                            typed: wordState.typed,
                            showUnTyped,
                            showHint: wordState.continueMissCount >= 3,
                            progress: `${wordState.index + 1} / ${wordState.words.length}`,
                            canPronounce: ready && !showResult,
                        }}
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
                <FavoriteResult
                    missCount={wordState.missCountSum}
                    results={wordState.results}
                    measures={measures}
                    retry={retry}
                    back={back}
                />
            )}
        </>
    );
};

export default Favorites;
