import type { NextPage } from 'next';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Word = {
    id: number;
    en: string;
    ja: string;
};

const Word: NextPage = () => {
    const [data, setData] = useState<Word[]>([
        {
            id: 0,
            en: 'mathematic',
            ja: '数学',
        },
        {
            id: 1,
            en: 'car',
            ja: '車',
        },
        {
            id: 2,
            en: 'book',
            ja: '本',
        },
        {
            id: 3,
            en: 'science',
            ja: '科学',
        },
        {
            id: 4,
            en: 'water',
            ja: '水',
        },
        {
            id: 5,
            en: 'computer',
            ja: '計算機',
        },
    ]);
    const [word, setWord] = useState<Word>();
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);

    const sound = useCallback((type: OscillatorType, sec: number, volume: number) => {
        const ctx = new AudioContext();
        const gain = ctx.createGain();
        const osc = ctx.createOscillator();
        osc.type = type;
        gain.gain.value = volume;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(sec);
    }, []);

    useEffect(() => {
        if (word === undefined) {
            return;
        }
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(word.en);
        const voice = window.speechSynthesis.getVoices().find((voice) => voice.voiceURI === 'Google US English');
        if (voice !== undefined) {
            utterance.voice = voice;
        }
        // synthesis.speak(utterance);
        setUnTyped(word.en);
        setTyped('');
    }, [word]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped.startsWith(key)) {
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
            } else {
                const body = ref.current;
                if (body === null) return;
                // sound('triangle', 0.1, 0.1);
                body.animate([{ backgroundColor: 'rgba(200, 0, 0, 0.1)' }, { backgroundColor: '' }], {
                    duration: 200,
                    direction: 'alternate',
                });
            }
        },
        [sound, unTyped]
    );

    useEffect(() => {
        document.onkeydown = handleKeyDown;
    }, [handleKeyDown]);

    useEffect(() => {
        if (unTyped === '') {
            setWord((prev) => {
                const index = Math.floor(Math.random() * data.length);
                let next = data[index];
                while (prev?.id === next.id) {
                    const index = Math.floor(Math.random() * data.length);
                    next = data[index];
                }
                return next;
            });
        }
    }, [data, typed, unTyped]);

    return (
        <div className="h-screen w-screen overflow-hidden" ref={ref}>
            <div className="w-full flex justify-between">
                <div className="w-fit">
                    <Link href={'/'}>
                        <div className="flex items-center m-2">
                            <div className="p-2 bg-blue-300 w-fit rounded-md">
                                <ArrowBackIcon style={{ width: '3rem', height: '3rem' }} />
                            </div>
                            <span className="text-lg font-bold">レベル選択に戻る</span>
                        </div>
                    </Link>
                </div>
                <div className="flex justify-center items-center m-2 p-2">
                    <SettingsIcon style={{ width: '3rem', height: '3rem' }} />
                </div>
            </div>
            <div className="h-4/5 relative">
                <div className="flex h-fit w-1/4 justify-start absolute top-1/3 left-1/4">
                    <div className="w-fit h-fit flex items-center justify-center p-2 bg-green-500 rounded-md">
                        <VolumeUpIcon style={{ width: '10rem', height: '10rem' }} />
                    </div>
                    <div className="flex flex-col justify-between ml-5">
                        <div className="">
                            <span className="text-5xl font-bold">{word?.ja}</span>
                        </div>
                        <div className="">
                            <span className="text-8xl font-bold">{typed}</span>
                            <span className="text-8xl font-bold text-gray-300">{unTyped}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Word;
