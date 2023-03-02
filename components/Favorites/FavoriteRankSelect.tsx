import React, { FC, Fragment } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { useRouter } from 'next/router';
import type { Mode, Rank } from '../../types';
import { allRanks } from '../../utils';
import useHasFavorites from '../../hooks/useHasFavorites';

type Props = {
    mode: Mode;
    rank: Rank;
};

type OptionProps = {
    rank: Rank;
};

const RankSelectOption: FC<OptionProps> = ({ rank }) => {
    return (
        <option value={rank} disabled={!useHasFavorites(rank)}>
            {rank}
        </option>
    );
};

const FavoriteRankSelect: FC<Props> = ({ mode, rank }) => {
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
                                pathname: `/${path.join(mode, e.currentTarget.value, 'favorites')}`,
                            });
                        }}
                    >
                        {allRanks.map((rank, i) => (
                            <Fragment key={i}>
                                <RankSelectOption rank={rank} />
                            </Fragment>
                        ))}
                    </NativeSelect>
                </FormControl>
            </Box>
        </div>
    );
};

export default FavoriteRankSelect;
