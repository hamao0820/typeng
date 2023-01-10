import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { pronounceVolumeContext } from '../../../Contexts/PronounceProvider';
import { soundEffectVolumeContext } from '../../../Contexts/SoundEffectProvider';
import { typingVolumeContext } from '../../../Contexts/TypingVolumeProvider';
import Marquee from '../../../components/Marquee';
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
};

type PathParams = {
    rank: '1' | '2' | '3' | '4';
    id: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
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

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
    const { rank, id } = context.params as PathParams;
    const dataDir = path.join(process.cwd(), 'data');
    const allWords = JSON.parse(fs.readFileSync(path.join(dataDir, `rank${rank}.json`), 'utf-8')) as Word[];
    return {
        props: {
            allWords: sliceByNumber(allWords, 100)[Number(id)],
        },
    };
};

const Test: NextPage<PageProps> = ({ allWords }) => {
    const [word, setWord] = useState<Word>();
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    const pronounceVolume = useContext(pronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const typingVolume = useContext(typingVolumeContext);
    const router = useRouter();
    const stage = router.asPath.split('stage=')[1];
    const [words, setWords] = useState<Word[]>(stage === 'all' ? allWords : sliceByNumber(allWords, 10)[Number(stage)]);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [missed, setMissed] = useState<boolean>(false);

    useEffect(() => {
        if (word === undefined) {
            return;
        }
        pronounce(word.en, pronounceVolume / 100);
        setMissed(false);
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

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped.startsWith(key)) {
                typeSound(typingVolume / 100);
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
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
                setMissed(true);
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
            <WorkHeader text="選択画面に戻る" href="/test" param={{ mode: 'test', ...(router.query as any) }} />
            <div className="h-4/5 relative w-full">
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

export default Test;
