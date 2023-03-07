import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Button from '@mui/material/Button';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import FavoriteHeader from '../../../components/Favorites/FavoriteHeader';
import ShowWord from '../../../components/Worker/ShowWord';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import useFavoriteWords from '../../../hooks/useFavoriteWords';
import useHasFavorites from '../../../hooks/useHasFavorites';
import { getRankWords } from '../../../middleware/getWords';
import type { Mode, PathParams, Rank } from '../../../types';
import { FavoritesPageProps } from '../../../types/favorite';
import { pronounce, sound, typeSound } from '../../../utils';

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
    const [showUnTyped, setShowUnTyped] = useState<boolean>(false);

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
        setShowUnTyped(false);
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
            if (e.altKey || e.metaKey || e.ctrlKey || e.key === 'Enter') return;
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
                <title>challenge</title>
            </Head>
            <div className="flex flex-col">
                <FavoriteHeader text="選択画面に戻る" href="/challenge" mode="challenge" />
                <div className="flex-1">
                    <ShowWord {...{ word, typed, unTyped, showUnTyped, showHint: missCount >= 3 }} />
                </div>
            </div>
            <div className="mt-5 flex w-screen justify-center">
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
    );
};

export default Favorites;
