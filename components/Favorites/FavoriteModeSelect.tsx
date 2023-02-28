import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { useRouter } from 'next/router';
import type { Mode, Rank } from '../../types';
import useHasFavorites from '../../hooks/useHasFavorites';

type Props = {
    mode: Mode;
    rank: Rank;
};

const FavoriteModeSelect: React.FC<Props> = ({ mode, rank }) => {
    const router = useRouter();
    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        モード
                    </InputLabel>
                    <NativeSelect
                        defaultValue={mode}
                        onChange={async (e) => {
                            await router.push(`/${path.join(e.currentTarget.value, rank, 'favorites')}`);
                        }}
                        disabled={!useHasFavorites(rank)}
                    >
                        <option value="practice">練習モード</option>
                        <option value="test"> 確認モード</option>
                        <option value="challenge">チャレンジモード</option>
                        <option value="scoring">採点モード</option>
                    </NativeSelect>
                </FormControl>
            </Box>
        </div>
    );
};

export default FavoriteModeSelect;
