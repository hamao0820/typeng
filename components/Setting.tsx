import React, { useContext } from 'react';
import { Box } from '@mui/system';
import { VolumeUp } from '@mui/icons-material';
import { Grid, Input, Slider } from '@mui/material';
import { pronounce, sound } from '../pages/practice/[rank]/[id]';
import { pronounceVolumeContext, setPronounceVolumeContext } from '../Contexts/PronounceProvider';
import { setSoundEffectVolumeContext, soundEffectVolumeContext } from '../Contexts/SoundEffectProvider';

export const Setting = () => {
    const pronounceVolume = useContext(pronounceVolumeContext);
    const setPronounceVolume = useContext(setPronounceVolumeContext);
    const soundEffectVolume = useContext(soundEffectVolumeContext);
    const setSoundEffectVolume = useContext(setSoundEffectVolumeContext);

    const handlePronounceSliderChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) return;
        setPronounceVolume(newValue);
    };

    const handlePronounceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPronounceVolume(event.target.value === '' ? 0 : Number(event.target.value));
        sound('sine', 0.1, Number(event.target.value) / 100);
    };

    const handlePronounceBlur = () => {
        if (pronounceVolume < 0) {
            setPronounceVolume(0);
            return;
        }
        if (pronounceVolume > 100) {
            setPronounceVolume(100);
            return;
        }
        pronounce(String(pronounceVolume), pronounceVolume / 100);
    };
    const handleSoundEffectSliderChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) return;
        setSoundEffectVolume(newValue);
    };

    const handleSoundEffectInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSoundEffectVolume(event.target.value === '' ? 0 : Number(event.target.value));
        sound('sine', 0.1, Number(event.target.value) / 100);
    };

    const handleSoundEffectBlur = () => {
        if (soundEffectVolume < 0) {
            setSoundEffectVolume(0);
            return;
        }
        if (soundEffectVolume > 100) {
            setSoundEffectVolume(100);
            return;
        }
    };
    return (
        <div className="h-40 w-60 border-2 border-solid border-black rounded-md absolute top-16 right-2 z-10 flex flex-col justify-center items-center bg-white">
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
                                    sound('sine', 0.1, Number(value) / 100);
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
    );
};
