import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Marquee';
import { Button } from '@mui/material';
import WorkHeader from '../../../components/WorkHeader';
import { pronounce, shuffle, sliceByNumber, sound, typeSound } from '../../practice/[rank]/[id]';
import path from 'path';
import fs from 'fs';

type Word = {
    id: number;
    en: string;
    ja: string;
};

type PageProps = {
    allWords: Word[];
    stage: string;
};

type PathParams = {
    rank: '1' | '2' | '3' | '4';
    id: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    // const { rank, id } = context.params as PathParams;
    // const dataDir = path.join(process.cwd(), 'data');
    // const allWords = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    // const { stage } = context.query as { stage: string };
    // return {
    //     props: {
    //         allWords: sliceByNumber(allWords, 100)[Number(id)],
    //         stage,
    //     },
    // };
    const { rank, id } = context.params as PathParams;
    const { stage } = context.query as { stage: string };
    return {
        props: {
            allWords: [],
            stage,
        },
    };
};

const Challenge: NextPage<PageProps> = ({ allWords, stage }) => {
    const [word, setWord] = useState<Word>();
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const [words, setWords] = useState<Word[]>(stage === 'all' ? allWords : sliceByNumber(allWords, 10)[Number(stage)]);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0);

    useEffect(() => {
        if (word === undefined) {
            return;
        }
        pronounce(word.en, pronounceVolume / 100);
        setShow(false);
        setUnTyped(word.en);
        setTyped('');
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
        if (word === undefined) return;
        const timer = setInterval(() => {
            pronounce(word.en, pronounceVolume / 100);
        }, 3000);
        return () => clearInterval(timer);
    }, [pronounceVolume, word]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped.startsWith(key)) {
                typeSound(typingVolume / 100);
                setMissCount(0);
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
            } else {
                if (unTyped[0].toUpperCase() === unTyped[0] && e.shiftKey) {
                    return;
                }
                const body = ref.current;
                if (body === null) return;
                setMissCount((prev) => prev + 1);
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
        document.onkeydown = handleKeyDown;
    }, [handleKeyDown]);

    useEffect(() => {
        if (words === undefined || words.length === 0) return;
        if (word === undefined || word.en === typed) {
            setWord((prev) => {
                const index = Math.floor(Math.random() * words.length);
                let next = words[index];
                while (prev?.id === next.id) {
                    const index = Math.floor(Math.random() * words.length);
                    next = words[index];
                }
                return next;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typed]);

    useEffect(() => {
        if (words === undefined || words.length === 0) return;

        setWord((prev) => {
            const index = Math.floor(Math.random() * words.length);
            let next = words[index];
            while (prev?.id === next.id) {
                const index = Math.floor(Math.random() * words.length);
                next = words[index];
            }
            return next;
        });
    }, [words]);

    useEffect(() => {
        if (stage === 'all') {
            setWords(allWords);
            return;
        }
        const words_ = sliceByNumber(allWords, 10)[Number(stage)];
        if (words_ === undefined) return;
        if (words === undefined || words.length === 0) {
            setWords(shuffle(words_));
            return;
        }
        if (words.length <= 10 && words_.map((word_) => word_.id).includes(words[0].id)) return;
        setWords(shuffle(words_));
    }, [allWords, stage, words]);

    return (
        <div className="h-screen w-screen overflow-hidden" ref={ref}>
            <WorkHeader
                text="選択画面に戻る"
                href="/challenge"
                param={{ mode: 'challenge', ...(router.query as any) }}
            />
            <div className="h-4/5 relative w-full">
                <div className="flex h-fit justify-start absolute top-1/3 left-60 w-full">
                    <div className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md">
                        <VolumeUpIcon
                            style={{ width: '13rem', height: '13rem' }}
                            onClick={() => {
                                if (word === undefined) return;
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
                        {word !== undefined && isOver && <Marquee content={word.ja} />}
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

export default Challenge;
