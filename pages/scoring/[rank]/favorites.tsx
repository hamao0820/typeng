import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Worker/Marquee';
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
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
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
        if (
            favoriteWords.length === 0 &&
            confirm('おめでとうございます!!\n苦手な単語がなくなりました!!\nステージ選択ページに移動しますか?')
        ) {
            await router.push({ pathname: '/scoring' });
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
        console.log('useEffect [word]');
        setUnTyped(word.en);
        const content = contentRef.current;
        if (content === null) return;
        if (800 <= content.clientWidth) {
            setIsOver(true);
        } else {
            setIsOver(false);
        }
        return () => {
            setShow(false);
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
            console.log('useEffect [pronounceVolume, word]');
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
                <FavoriteHeader text="選択画面に戻る" href="/scoring" mode="scoring" />
                <div className="h-4/5 relative w-full">
                    {words && (
                        <div className="absolute top-5 right-10 text-3xl">
                            {index + 1} / {words.length}
                        </div>
                    )}
                    <div className="flex h-fit justify-start absolute top-1/3 left-60 w-full">
                        <div className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md">
                            <VolumeUpIcon
                                style={{ width: '13rem', height: '13rem' }}
                                onClick={() => {
                                    if (word === null) return;
                                    console.log('onclick');
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
                                    {word?.ja}
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
