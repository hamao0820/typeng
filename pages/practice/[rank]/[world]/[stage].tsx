import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef } from 'react';

import ShowWord from '../../../../components/Worker/ShowWord';
import WorkHeader from '../../../../components/Worker/WorkHeader';
import { pronounceVolumeContext } from '../../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../../Contexts/TypingVolumeProvider';
import useWord from '../../../../hooks/useWord';
import { getStageWords } from '../../../../middleware/getWords';
import type { PageProps, PathParam, PathParams } from '../../../../types';
import { pronounce, sound, stageLoadMap, typeSound } from '../../../../utils';

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
    return {
        paths: stageLoadMap.map((v) => {
            return { params: v.stage };
        }),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
    const pathParams = context.params as PathParams;
    const pathParam: PathParam = { ...pathParams, mode: 'practice' };
    const words = getStageWords(pathParams);
    return { props: { words, pathParam } };
};

const Practice: NextPage<PageProps> = ({ words }) => {
    const router = useRouter();
    const { word, typed, unTyped, handleWord } = useWord(words);
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);

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

    useEffect(() => {
        const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            handleWord(e);
            handleEffect(e);
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [handleEffect, handleWord]);

    return (
        <div className="h-screen w-screen" ref={ref}>
            <Head>
                <title>practice</title>
            </Head>
            <div className="flex flex-col">
                <WorkHeader
                    text="選択画面に戻る"
                    href="/practice"
                    param={{ mode: 'practice', ...(router.query as any) }}
                />
                <div className="flex-1">
                    <ShowWord {...{ word, typed, unTyped }} />
                </div>
            </div>
        </div>
    );
};

export default Practice;
