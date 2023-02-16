import React, { FC } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { useRouter } from 'next/router';
import type { PathParam } from '../types';
import { wordsCounts } from '../utils';

type Props = {
    param: PathParam;
};

const RankSelect: FC<Props> = ({ param }) => {
    const { mode, rank } = param;
    const router = useRouter();
    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        rank
                    </InputLabel>
                    <NativeSelect
                        defaultValue={rank}
                        value={rank}
                        onChange={async (e) => {
                            await router.push({
                                pathname: `/${path.join(mode, e.currentTarget.value, '0')}`,
                                query: { stage: '0' },
                            });
                            router.reload();
                        }}
                    >
                        {wordsCounts.map((_, i) => (
                            <option key={i} value={String(i + 1)}>
                                {i + 1}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
            </Box>
        </div>
    );
};

export default RankSelect;
