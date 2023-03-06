import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import React, { FC, MouseEvent, useState } from 'react';

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
                <Typography className="ml-1 text-lg">{'Text Size'}: </Typography>
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
