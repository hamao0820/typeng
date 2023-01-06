import fs from 'fs';
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import Header from '../../../components/Header';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Marquee';
import { Button } from '@mui/material';
import CountDown from '../../../components/CountDown';

type Word = {
    id: number;
    en: string;
    ja: string;
};

type PageProps = {
    allWords: Word[];
};

type PathParams = {
    rank: '1' | '2' | '3' | '4';
    id: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
};

export const sliceByNumber = <T,>(array: T[], number: number): T[][] => {
    const length = Math.ceil(array.length / number);
    const newArr: T[][] = [];
    for (let i = 0; i < length; i++) {
        newArr.push(array.slice(number * i, number * (i + 1)));
    }
    return newArr;
};

export const pronounce = (word: string, volume: number) => {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(word);
    const voice = window.speechSynthesis.getVoices().find((voice) => voice.voiceURI === 'Google US English');
    if (voice !== undefined) {
        utterance.voice = voice;
    }
    utterance.volume = volume;
    synthesis.speak(utterance);
};

export const sound = (type: OscillatorType, sec: number, volume: number) => {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    osc.type = type;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(sec);
};

export const typeSound = async (volume: number): Promise<void> => {
    const audio = new Audio('/typing.mp3');
    audio.volume = volume;
    audio.play();
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
    return {
        paths: [
            { params: { rank: '1', id: '0' } },
            { params: { rank: '1', id: '1' } },
            { params: { rank: '1', id: '2' } },
            { params: { rank: '1', id: '3' } },
            { params: { rank: '1', id: '4' } },
            { params: { rank: '1', id: '5' } },
            { params: { rank: '1', id: '6' } },
            { params: { rank: '1', id: '7' } },
            { params: { rank: '1', id: '8' } },
            { params: { rank: '1', id: '9' } },
            { params: { rank: '2', id: '0' } },
            { params: { rank: '2', id: '1' } },
            { params: { rank: '2', id: '2' } },
            { params: { rank: '2', id: '3' } },
            { params: { rank: '2', id: '4' } },
            { params: { rank: '2', id: '5' } },
            { params: { rank: '2', id: '6' } },
            { params: { rank: '2', id: '7' } },
            { params: { rank: '2', id: '8' } },
            { params: { rank: '3', id: '0' } },
            { params: { rank: '3', id: '1' } },
            { params: { rank: '3', id: '2' } },
            { params: { rank: '3', id: '3' } },
            { params: { rank: '3', id: '4' } },
            { params: { rank: '3', id: '5' } },
            { params: { rank: '3', id: '6' } },
            { params: { rank: '3', id: '7' } },
            { params: { rank: '3', id: '8' } },
            { params: { rank: '3', id: '9' } },
            { params: { rank: '3', id: '10' } },
            { params: { rank: '4', id: '0' } },
            { params: { rank: '4', id: '1' } },
            { params: { rank: '4', id: '2' } },
            { params: { rank: '4', id: '3' } },
            { params: { rank: '4', id: '4' } },
            { params: { rank: '4', id: '5' } },
            { params: { rank: '4', id: '6' } },
            { params: { rank: '4', id: '7' } },
            { params: { rank: '4', id: '8' } },
            { params: { rank: '4', id: '9' } },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<PageProps> = async (context): Promise<GetStaticPropsResult<PageProps>> => {
    const { rank, id } = context.params as PathParams;
    const allWords = JSON.parse(fs.readFileSync(`data/rank${rank}.json`, 'utf-8')) as Word[];
    return {
        props: {
            allWords: sliceByNumber(allWords, 100)[Number(id)],
        },
    };
};

const Scoring: NextPage<PageProps> = ({ allWords }) => {
    const [word, setWord] = useState<Word>();
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const { stage } = router.query as { stage: string };
    const [words, setWords] = useState<Word[]>(stage === 'all' ? allWords : sliceByNumber(allWords, 10)[Number(stage)]);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [missCount, setMissCount] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        if (!ready) return;
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
    }, [word, ready]);

    useEffect(() => {
        if (!ready) return;
        if (word === undefined) return;
        const timer = setInterval(() => {
            pronounce(word.en, pronounceVolume / 100);
        }, 3000);
        return () => clearInterval(timer);
    }, [pronounceVolume, ready, word]);

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
        if (!ready) return;
        document.onkeydown = handleKeyDown;
    }, [handleKeyDown, ready]);

    useEffect(() => {
        if (words === undefined) {
            const words_ = stage === 'all' ? allWords : sliceByNumber(allWords, 10)[Number(stage)];
            if (stage !== undefined && words_ === undefined) {
                router.push('/scoring');
                return;
            }
            if (words_ === undefined) return;
            setWords(stage === 'all' ? allWords : words_);
            return;
        }
        if (unTyped === '') {
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
    }, [allWords, router, stage, typed, unTyped, words]);

    return (
        <>
            {!ready && <CountDown ready={ready} setReady={setReady} />}
            <div className="h-screen w-screen overflow-hidden" ref={ref}>
            {!ready && <CountDown ready={ready} setReady={setReady} />}
                <Header text="選択画面に戻る" href="/scoring" />
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
        </>
    );
};

export default Scoring;
