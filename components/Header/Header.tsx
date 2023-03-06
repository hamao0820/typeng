import UnfoldLess from '@mui/icons-material/UnfoldLess';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuthContext } from '../../Contexts/AuthProvider';
import type { Mode } from '../../types';
import SettingButton from '../Setting/SettingButton';
import BackButton from './BackButton';

type Props = {
    text: string;
    href: string;
    mode: Mode;
    collapseAll: () => void;
};

const Header: React.FC<Props> = ({ text, href, mode, collapseAll }) => {
    const router = useRouter();
    const { user } = useAuthContext();
    return (
        <div className="w-full flex justify-between items-center">
            <BackButton href={href} text={text} />
            <div className="flex items-center flex-col">
                <div>リストを右クリックすると単語一覧が表示されます</div>
                {user ? (
                    <div>一覧から苦手な単語を登録することができます</div>
                ) : (
                    <div>ログインすると一覧から苦手な単語を登録することができます</div>
                )}
            </div>
            <div className="flex items-center">
                <div
                    className="cursor-pointer border-2 border-solid border-blue-200 rounded-md mr-2"
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
