import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Worker/Marquee';
import WorkHeader from '../../../components/Worker/WorkHeader';
import Head from 'next/head';
import useWord from '../../../hooks/useWord';
import getAllWords from '../../../middleware/getAllWords';
import type { PageProps, PathParam, PathParams, Stage } from '../../../types';
import { pronounce, sound, typeSound } from '../../../utils';

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    const { rank, id } = context.params as PathParams;
    const { stage } = context.query as { stage: Stage };
    const pathParam: PathParam = { mode: 'practice', rank, id, stage };
    const allWords = getAllWords(rank, id);
    return { props: { allWords, pathParam } };
};

const Practice: NextPage<PageProps> = ({ allWords, pathParam }) => {
    const router = useRouter();
    const { stage } = pathParam;
    const { word, typed, unTyped, handleWord } = useWord(allWords, stage);
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);

    useEffect(() => {
        if (word === undefined) {
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
        document.onkeydown = handleKeyDown;
    }, [handleKeyDown]);

    return (
        <div className="h-screen w-screen overflow-hidden" ref={ref}>
            <Head>
                <title>practice</title>
            </Head>
            <WorkHeader text="選択画面に戻る" href="/practice" param={{ mode: 'practice', ...(router.query as any) }} />
            <div className="h-4/5 relative w-full">
                {word && <div className="absolute top-5 right-10 text-3xl">id: {word.id + 1}</div>}
                <div className="flex h-fit justify-start absolute top-1/3 left-60 w-full">
                    <div
                        className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md"
                        onClick={() => {
                            if (word === undefined) return;
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

                        {word !== undefined && isOver && <Marquee content={word.ja} />}
                        <div className="whitespace-nowrap">
                            <span className="text-8xl font-bold whitespace-nowrap">{typed.replaceAll(' ', '␣')}</span>
                            <span className="text-8xl font-bold text-gray-300 whitespace-nowrap">
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

export default Practice;
