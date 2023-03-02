import type { GetServerSideProps, NextPage } from 'next';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Worker/Marquee';
import { pronounce, sound, typeSound } from '../../../utils';
import Head from 'next/head';
import type { Mode, PathParams, Rank } from '../../../types';
import FavoriteStar from '../../../components/Favorites/FavoriteStar';
import { FavoritesPageProps } from '../../../types/favorite';
import getRankWords from '../../../middleware/getRankWords';
import useFavoriteWords from '../../../hooks/useFavoriteWords';
import FavoriteHeader from '../../../components/Favorites/FavoriteHeader';
import { useRouter } from 'next/router';
import useHasFavorites from '../../../hooks/useHasFavorites';

export const getServerSideProps: GetServerSideProps<FavoritesPageProps> = async (context) => {
    const { rank } = context.params as PathParams;
    const rankWords = getRankWords(rank);
    return { props: { rankWords } };
};

const Favorites: NextPage<FavoritesPageProps> = ({ rankWords }) => {
    const { word, typed, unTyped, missed, handleWord } = useFavoriteWords(rankWords);
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);

    const router = useRouter();
    const { rank } = router.query as { rank: Rank };
    const mode = router.pathname.split('/')[1] as Mode; // /mode/[rank]/favorites
    if (!useHasFavorites(rank)) {
        router.push({ pathname: `/${mode}` });
    }

    useEffect(() => {
        if (word === null) {
            return;
        }
        pronounce(word.en, pronounceVolume / 100);
        const content = contentRef.current;
        if (content === null) return;
        if (800 <= content.clientWidth) {
            setIsOver(true);
        } else {
            setIsOver(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [word]);

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
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="h-screen w-screen overflow-hidden" ref={ref}>
            <Head>
                <title>test</title>
            </Head>
            <FavoriteHeader text="選択画面に戻る" href="/test" mode="test" />
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
                    <div
                        className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md"
                        onClick={() => {
                            if (word === null) return;
                            pronounce(word.en, pronounceVolume);
                        }}
                    >
                        <VolumeUpIcon style={{ width: '13rem', height: '13rem' }} />
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
                            <span
                                className="text-8xl font-bold text-gray-300 whitespace-nowrap"
                                style={missed ? {} : { display: 'none' }}
                            >
                                {unTyped.replaceAll(' ', '␣')}
                            </span>
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
