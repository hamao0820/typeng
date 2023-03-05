import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Button from '@mui/material/Button';
import { pronounce, shuffle, sound, typeSound } from '../../../utils';
import Head from 'next/head';
import type { PathParams, ResultType, Word } from '../../../types';
import FavoriteHeader from '../../../components/Favorites/FavoriteHeader';
import { FavoritesPageProps } from '../../../types/favorite';
import getRankWords from '../../../middleware/getRankWords';
import { useFavoritesContext } from '../../../Contexts/FavoritesProvider';
import FavoriteResult from '../../../components/Favorites/FavoriteResult';
import FavoriteCountDown from '../../../components/Favorites/FavoriteCountDown';
import ShowWord from '../../../components/Worker/ShowWord';

export const getServerSideProps: GetServerSideProps<FavoritesPageProps> = async (context) => {
    const { rank } = context.params as PathParams;
    const rankWords = getRankWords(rank);
    return { props: { rankWords } };
};

const Favorites: NextPage<FavoritesPageProps> = ({ rankWords }) => {
    const [word, setWord] = useState<Word | null>(null);
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const [words, setWords] = useState<Word[]>([]);
    const [results, setResults] = useState<ResultType[]>([]);
    const [showUnTyped, setShowUnTyped] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0);
    const [miss, setMiss] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [missCountSum, setMissCountSum] = useState<number>(0);
    const [measure, setMeasure] = useState<PerformanceEntryList>([]);
    const favorites = useFavoritesContext();
    const favoriteWords = useMemo(() => {
        return (favorites.map((id) => rankWords.find((word) => word.id === id)).filter((v) => v) as Word[]).sort(
            (a, b) => a.id - b.id
        );
    }, [favorites, rankWords]);

    const initState = useCallback(() => {
        setResults([]);
        setReady(false);
        setIndex(0);
        setShowResult(false);
        setMissCountSum(0);
        setMeasure([]);
        setWords(shuffle(favoriteWords));
    }, [favoriteWords]);

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
        setShowResult((pre) => {
            if (!pre) {
                setWords(shuffle(favoriteWords));
            }
            return pre;
        });
    }, [favoriteWords]);

    useEffect(() => {
        if (words.length === 0) return;
        setWord(words[0]);
    }, [words]);

    useEffect(() => {
        if (words.length === 0) return;
        if (words.length === index) {
            setWord(null);
            performance.mark('end');
            performance.measure('measure', 'start', 'end');
            setMeasure(performance.getEntriesByName('measure'));
            setShowResult(true);
            return;
        }
        setWord(words[index]);
    }, [index, words]);

    useEffect(() => {
        if (word === null) return;
        setUnTyped(word.en);
        return () => {
            setShowUnTyped(false);
            setTyped('');
            setMissCount(0);
            setMiss((prevMiss) => {
                setResults((prev) => [...prev, { ...word, correct: !prevMiss }]);
                return false;
            });
        };
    }, [word]);

    useEffect(() => {
        if (ready === false || word === null) return;
        const preVolume = pronounceVolume;
        let ignore = false;
        if (!ignore) {
            pronounce(word.en, pronounceVolume / 100);
        }
        return () => {
            ignore = preVolume !== pronounceVolume;
        };
    }, [pronounceVolume, word, ready]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped.startsWith(key)) {
                typeSound(typingVolume / 100);
                setMissCount(0);
                if (unTyped.length === 1) {
                    setIndex((preIndex) => preIndex + 1);
                    return;
                }
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
            } else if (unTyped[0].toUpperCase() === unTyped[0] && e.shiftKey) {
                return;
            } else {
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
        },
        [soundEffectVolume, typingVolume, unTyped]
    );

    useEffect(() => {
        if (!ready) return;
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, ready]);

    useEffect(() => {
        if (showResult) {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown, showResult]);

    useEffect(() => {
        if (!ready) return;
        performance.mark('start');
    }, [ready]);

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
                            word,
                            unTyped,
                            typed,
                            showUnTyped,
                            showHint: miss,
                            progress: `${index + 1} / ${words.length}`,
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
                    missCount={missCountSum}
                    results={results}
                    measure={measure}
                    retry={retry}
                    back={back}
                />
            )}
        </>
    );
};

export default Favorites;
