import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { PathParam } from './WorkHeader';
import { useRouter } from 'next/router';

type Props = {
    param: PathParam;
};

const ModeSelect: React.FC<Props> = ({ param }) => {
    const router = useRouter()
    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        モード
                    </InputLabel>
                    <NativeSelect
                        defaultValue={param.mode}
                        onChange={(e) => {
                            router.push(
                                `/${path.join(e.currentTarget.value, param.rank, param.id)}?stage=${param.stage}`
                            );
                        }}
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

export default ModeSelect;