import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import path from 'path';
import { useRouter } from 'next/router';
import type { PathParam } from '../../types';
import { rankIndicesObj, sliceByNumber } from '../../utils';

type Props = {
    param: PathParam;
};

const wordsNumObj: { [rank: string]: number } = { '1': 956, '2': 882, '3': 1024, '4': 938 };

const StageSelect: React.FC<Props> = ({ param }) => {
    const router = useRouter();
    const allIndices = sliceByNumber(
        rankIndicesObj.find((v) => {
            return v.rank === param.rank;
        })!.indices,
        100
    )[Number(param.id)];
    const stages = sliceByNumber(allIndices, 10);
    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        stage
                    </InputLabel>
                    <NativeSelect
                        defaultValue={param.stage}
                        value={param.stage}
                        onChange={async (e) => {
                            await router.push({
                                pathname: `/${path.join(param.mode, param.rank, param.id)}`,
                                query: { stage: e.currentTarget.value },
                            });
                        }}
                    >
                        <option value="all">{`${allIndices[0]} ~ ${allIndices.slice(-1)[0]}`}</option>
                        {stages.map((_, i) => (
                            <option key={i} value={String(i)}>
                                {`${stages[i][0]} ~ ${stages[i].slice(-1)[0]}`}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
            </Box>
        </div>
    );
};

export default StageSelect;
