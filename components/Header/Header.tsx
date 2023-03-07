import UnfoldLess from '@mui/icons-material/UnfoldLess';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import { useRouter } from 'next/router';
import React from 'react';

import type { Mode } from '../../types';
import SettingButton from '../Setting/SettingButton';
import BackButton from './BackButton';
import InformationButton from './InformationButton';

type Props = {
    text: string;
    href: string;
    mode: Mode;
    collapseAll: () => void;
};

const Header: React.FC<Props> = ({ text, href, mode, collapseAll }) => {
    const router = useRouter();
    return (
        <div className="flex w-full items-center justify-between">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
                <div className="mx-1">
                    <InformationButton />
                </div>
                <div
                    className="mr-2 cursor-pointer rounded-md border-2 border-solid border-blue-200"
                    onClick={collapseAll}
                >
                    <UnfoldLess style={{ width: '3rem', height: '3rem' }} />
                </div>
                <div>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                モード
                            </InputLabel>
                            <NativeSelect
                                defaultValue={mode}
                                onChange={(e) => {
                                    router.push(`/${e.currentTarget.value}`);
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
                <div
                    className="relative m-2 flex items-center justify-center p-2"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <SettingButton />
                </div>
            </div>
        </div>
    );
};

export default Header;
