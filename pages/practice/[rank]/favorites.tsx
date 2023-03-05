import React, { FC, useCallback, useContext, useEffect, useRef } from 'react';
import { FavoritesPageProps } from '../../../types/favorite';
import { GetServerSideProps } from 'next';
import { Mode, PathParams, Rank } from '../../../types';
import getRankWords from '../../../middleware/getRankWords';
import useFavoriteWords from '../../../hooks/useFavoriteWords';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import { pronounce, sound, typeSound } from '../../../utils';
import Head from 'next/head';
import FavoriteHeader from '../../../components/Favorites/FavoriteHeader';
import { useRouter } from 'next/router';
import useHasFavorites from '../../../hooks/useHasFavorites';
import ShowWord from '../../../components/Worker/ShowWord';

export const getServerSideProps: GetServerSideProps<FavoritesPageProps> = async (context) => {
    const { rank } = context.params as PathParams;
    const rankWords = getRankWords(rank);
    return { props: { rankWords } };
};

const Favorites: FC<FavoritesPageProps> = ({ rankWords }) => {
    const { word, typed, unTyped, handleWord } = useFavoriteWords(rankWords);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const ref = useRef<HTMLDivElement>(null);
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
                <title>practice</title>
            </Head>
            <div className="flex flex-col">
                <FavoriteHeader text="選択画面に戻る" href="/practice" mode="practice" />
                <div className="flex-1">
                    <ShowWord {...{ word, typed, unTyped }} />
                </div>
            </div>
        </div>
    );
};

export default Favorites;
