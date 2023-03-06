import React, { FC, MouseEvent, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/system/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTextSizeContext } from '../../Contexts/TextSizeProvider';
import { TextSize } from '../../types';

const SettingTextSize: FC = () => {
    const { textSize, setTextSize } = useTextSizeContext();
    const [alignment, setAlignment] = useState<TextSize>(textSize);
    const handleChange = (event: MouseEvent<HTMLElement>, newAlignment: TextSize) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            setTextSize(newAlignment);
        }
    };
    return (
        <div className="m-2">
            <Box sx={{ width: 200 }}>
                <Typography className="text-lg ml-1">{'Text Size'}: </Typography>
                <Grid container spacing={2} justifyContent={'center'}>
                    <Grid item>
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                        >
                            <ToggleButton value={'small'} sx={{ paddingY: 0.5, paddingX: 2 }}>
                                <span className="text-sm font-bold">s</span>
                            </ToggleButton>
                            <ToggleButton value={'middle'} sx={{ paddingY: 0.5, paddingX: 2 }}>
                                <span className="text-base font-bold">m</span>
                            </ToggleButton>
                            <ToggleButton value={'large'} sx={{ paddingY: 0.5, paddingX: 2 }}>
                                <span className="text-lg font-bold">L</span>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default SettingTextSize;