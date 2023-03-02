import type { GetServerSideProps, NextPage } from 'next';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Worker/Marquee';
import Button from '@mui/material/Button';
import { pronounce, sound, typeSound } from '../../../utils';
import Head from 'next/head';
import type { PathParams } from '../../../types';
import FavoriteStar from '../../../components/Favorites/FavoriteStar';
import getRankWords from '../../../middleware/getRankWords';
import { FavoritesPageProps } from '../../../types/favorite';
import useFavoriteWords from '../../../hooks/useFavoriteWords';
import FavoriteHeader from '../../../components/Favorites/FavoriteHeader';

export const getServerSideProps: GetServerSideProps<FavoritesPageProps> = async (context) => {
    const { rank } = context.params as PathParams;
    const rankWords = getRankWords(rank);
    return { props: { rankWords } };
};

const Favorites: NextPage<FavoritesPageProps> = ({ rankWords }) => {
    const { word, typed, unTyped, missCount, handleWord } = useFavoriteWords(rankWords);
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (word === null) {
            return;
        }
        pronounce(word.en, pronounceVolume / 100);
        setShow(false);
        const content = contentRef.current;
        if (content === null) return;
        if (800 <= content.clientWidth) {
            setIsOver(true);
        } else {
            setIsOver(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [word]);

    useEffect(() => {
        if (word === null) return;
        const timer = setInterval(() => {
            pronounce(word.en, pronounceVolume / 100);
        }, 3000);
        return () => clearInterval(timer);
    }, [pronounceVolume, word]);

    const handleEffect = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped.startsWith(key)) {
                typeSound(typingVolume / 100);
            } else {
                if (unTyped[0].toUpperCase() === unTyped[0] && e.shiftKey) {
                    return;
                }
                const body = ref.current;
                if (body === null) return;
                sound('sine', 0.1, soundEffectVolume / 100);
                body.animate([{ backgroundColor: 'rgba(200, 0, 0, 0.1)' }, { backgroundColor: '' }], {
                    duration: 300,
                    direction: 'alternate',
                });
            }
        },
        [unTyped, typingVolume, soundEffectVolume]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            handleWord(e);
            handleEffect(e);
        },
        [handleWord, handleEffect]
    );

    useEffect(() => {
        document.onkeydown = handleKeyDown;
    }, [handleKeyDown]);

    return (
        <div className="h-screen w-screen overflow-hidden" ref={ref}>
            <Head>
                <title>challenge</title>
            </Head>
            <FavoriteHeader text="選択画面に戻る" href="/challenge" mode="challenge" />
            <div className="h-4/5 relative w-full">
                {word && (
                    <div className="absolute top-5 right-12 flex justify-between items-center w-32">
                        <div>
                            <FavoriteStar word={word} />
                        </div>
                        <div className="text-3xl whitespace-nowrap">id: {word.id}</div>
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
                                {word?.ja}
                            </span>
                        </div>
                        {word !== null && isOver && <Marquee content={word.ja} />}
                        <div className="whitespace-nowrap">
                            <span className="text-8xl font-bold whitespace-nowrap">{typed.replaceAll(' ', '␣')}</span>
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
    );
};

export default Favorites;
