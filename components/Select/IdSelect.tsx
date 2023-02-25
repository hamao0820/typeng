import React, { FC } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { useRouter } from 'next/router';
import type { PathParam } from '../../types';
import { rankIndicesObj, sliceByNumber } from '../../utils';
import useHasFavorites from '../../hooks/useHasFavorites';

type Props = {
    param: PathParam;
};

const IdSelect: FC<Props> = ({ param }) => {
    const { mode, rank, id } = param;
    const router = useRouter();
    const allIndices = sliceByNumber(
        rankIndicesObj.find((v) => {
            return v.rank === rank;
        })!.indices,
        100
    );
    const hasFavorite = useHasFavorites(rank);

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
                            const id = e.currentTarget.value;
                            if (id === 'favorites') {
                                await router.push({ pathname: `/${path.join(mode, rank, id)}` });
                                return;
                            }
                            await router.push({
                                pathname: `/${path.join(mode, rank, id)}`,
                                query: { stage: '0' },
                            });
                        }}
                    >
                        {hasFavorite && <option value="favorites">★</option>}
                        {allIndices.map((indices, i) => (
                            <option key={i} value={String(i)}>
                                {`${indices[0]} ~ ${indices.at(-1)!}`}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
            </Box>
        </div>
    );
};

export default IdSelect;
