import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useRouter } from 'next/router';
import path from 'path';
import BackButton from './BackButton';
import SettingButton from './SettingButton';

type Props = {
    text: string;
    href: string;
    mode: string;
};

const Header: React.FC<Props> = ({ text, href, mode }) => {
    const router = useRouter();
    return (
        <div className="w-full flex justify-between items-center">
            <BackButton href={href} text={text} />
            <div className="flex items-center">
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
                    className="flex justify-center items-center m-2 p-2 relative"
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
