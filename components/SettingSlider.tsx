import React from 'react';
import Box from '@mui/system/Box';
import VolumeUp from '@mui/icons-material/VolumeUp';
// import { Grid, Input, Slider } from '@mui/material';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';

type Props = {
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
    item: string;
    check: (volume: number) => void;
};

const SettingSlider: React.FC<Props> = ({ volume, setVolume, item, check }) => {
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) return;
        setVolume(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(event.target.value === '' ? 0 : Number(event.target.value));
        check(Number(event.target.value));
    };

    const handleBlur = () => {
        if (volume < 0) {
            setVolume(0);
            return;
        }
        if (volume > 100) {
            setVolume(100);
            return;
        }
        check(volume);
    };
    return (
        <div className="m-2">
            <Box sx={{ width: 200 }}>
                <span className="text-lg ml-1">{item}: </span>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <VolumeUp />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof volume === 'number' ? volume : 0}
                            onChange={handleSliderChange}
                            onChangeCommitted={(e) => {
                                const target = e.target;
                                if (target === undefined) return;
                                const value = (target as HTMLElement).querySelector('input')?.value;
                                if (value === undefined) return;
                                check(Number(value));
                            }}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={volume}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
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
    );
};

export default SettingSlider;
