import React, { FC } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { useRouter } from 'next/router';
import type { PathParam } from '../types';
import { sliceByNumber, wordsCounts } from '../utils';

type Props = {
    param: PathParam;
};

const IdSelect: FC<Props> = ({ param }) => {
    const { mode, rank, id } = param;
    const router = useRouter();
    const wordsCount = wordsCounts[Number(rank) - 1];
    const allIndices = sliceByNumber(
        [...Array(wordsCount)].map((_, i) => i),
        100
    );

    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        id
                    </InputLabel>
                    <NativeSelect
                        defaultValue={id}
                        value={id}
                        onChange={async (e) => {
                            await router.push({
                                pathname: `/${path.join(mode, rank, e.currentTarget.value)}`,
                                query: { stage: '0' },
                            });
                            if (param.mode === 'scoring') {
                                router.reload();
                            }
                        }}
                    >
                        {allIndices.map((indices, i) => (
                            <option key={i} value={String(i)}>
                                {`${indices[0] + 1} ~ ${indices.at(-1)! + 1}`}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
            </Box>
        </div>
    );
};

export default IdSelect;
