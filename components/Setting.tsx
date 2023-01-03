import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack } from '@mui/system';
import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { Grid, Input, Slider, Typography } from '@mui/material';
import { pronounce, sound } from '../pages/word';
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
