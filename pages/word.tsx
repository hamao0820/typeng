import type { NextPage } from 'next';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack } from '@mui/system';
import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Grid, Input, Slider, Typography } from '@mui/material';

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
    const [pronounceVolume, setPronounceVolume] = useState<number>(100);
    const [soundEffectVolume, setSoundEffectVolume] = useState<number>(10);
    const [isSetting, setIsSetting] = useState<boolean>(false);

    const pronounce = useCallback((word: string, volume: number) => {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(word);
        const voice = window.speechSynthesis.getVoices().find((voice) => voice.voiceURI === 'Google US English');
        if (voice !== undefined) {
            utterance.voice = voice;
        }
        utterance.volume = volume;
        synthesis.speak(utterance);
    }, []);

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
        pronounce(word.en, pronounceVolume / 100);
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
                sound('sine', 0.1, soundEffectVolume / 100);
                body.animate([{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }, { backgroundColor: '' }], {
                    duration: 200,
                    direction: 'alternate',
                });
            }
        },
        [sound, unTyped, soundEffectVolume]
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

    const handleSetting = () => {
        setIsSetting((prev) => !prev);
        document.onclick = () => {
            setIsSetting(false);
        };
    };

    const handlePronounceSliderChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) return;
        setPronounceVolume(newValue);
    };

    const handlePronounceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPronounceVolume(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handlePronounceBlur = () => {
        if (pronounceVolume < 0) {
            setPronounceVolume(0);
        } else if (pronounceVolume > 100) {
            setPronounceVolume(100);
        }
    };
    const handleSoundEffectSliderChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) return;
        setSoundEffectVolume(newValue);
    };

    const handleSoundEffectInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSoundEffectVolume(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleSoundEffectBlur = () => {
        if (soundEffectVolume < 0) {
            setSoundEffectVolume(0);
        } else if (soundEffectVolume > 100) {
            setSoundEffectVolume(100);
        }
    };

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
                <div
                    className="flex justify-center items-center m-2 p-2 relative"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="cursor-pointer" onClick={handleSetting}>
                        <SettingsIcon style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    {isSetting && (
                        <div className="h-40 w-60 border-2 border-solid border-black rounded-md absolute top-16 right-2 z-10 flex flex-col justify-center items-center">
                            <div className="m-2">
                                <Box sx={{ width: 200 }}>
                                    <span className="text-lg ml-1">Pronounce: </span>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <VolumeUp />
                                        </Grid>
                                        <Grid item xs>
                                            <Slider
                                                value={typeof pronounceVolume === 'number' ? pronounceVolume : 0}
                                                onChange={handlePronounceSliderChange}
                                                onChangeCommitted={(e) => {
                                                    const target = e.target;
                                                    if (target === undefined) return;
                                                    const value = (target as HTMLElement).querySelector('input')?.value;
                                                    if (value === undefined) return;
                                                    pronounce(value, Number(value) / 100);
                                                }}
                                                aria-labelledby="input-slider"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Input
                                                value={pronounceVolume}
                                                size="small"
                                                onChange={handlePronounceInputChange}
                                                onBlur={handlePronounceBlur}
                                                inputProps={{
                                                    step: 10,
                                                    min: 0,
                                                    max: 100,
                                                    type: 'number',
                                                    'aria-labelledby': 'input-slider',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                            <div className="m-2">
                                <Box sx={{ width: 200 }}>
                                    <span className="text-lg ml-1">Sound Effect: </span>

                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <VolumeUp />
                                        </Grid>
                                        <Grid item xs>
                                            <Slider
                                                value={typeof soundEffectVolume === 'number' ? soundEffectVolume : 0}
                                                onChange={handleSoundEffectSliderChange}
                                                onChangeCommitted={(e) => {
                                                    const target = e.target;
                                                    if (target === undefined) return;
                                                    const value = (target as HTMLElement).querySelector('input')?.value;
                                                    if (value === undefined) return;
                                                    sound("sine", 0.1, Number(value) / 100);
                                                }}
                                                aria-labelledby="input-slider"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Input
                                                value={soundEffectVolume}
                                                size="small"
                                                onChange={handleSoundEffectInputChange}
                                                onBlur={handleSoundEffectBlur}
                                                inputProps={{
                                                    step: 10,
                                                    min: 0,
                                                    max: 100,
                                                    type: 'number',
                                                    'aria-labelledby': 'input-slider',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                        </div>
                    )}
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
