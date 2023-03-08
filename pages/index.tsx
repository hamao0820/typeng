import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { NextPage } from 'next';
import Head from 'next/head';
import { forwardRef, useState } from 'react';

import Logo from '../components/ModeSelection/Logo';
import ModeCard from '../components/ModeSelection/ModeCard';
import SignInButton from '../components/ModeSelection/SignInButton';
import SignOutButton from '../components/ModeSelection/SignOutButton';
import SettingButton from '../components/Setting/SettingButton';
import { useAuthContext } from '../Contexts/AuthProvider';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// TODO: icoを用意
const Home: NextPage = () => {
    const { user } = useAuthContext();
    const [openSnack, setOpenSnack] = useState<boolean>(false);
    const onSignOut = () => {
        setOpenSnack(true);
    };
    return (
        <>
            <Head>
                <title>Typeng</title>
            </Head>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnack}
                onClose={() => setOpenSnack(false)}
                autoHideDuration={3000}
            >
                <Alert onClose={() => setOpenSnack(false)} severity="success" sx={{ width: '100%' }}>
                    サインアウトしました
                </Alert>
            </Snackbar>
            <div className="flex h-screen flex-col overflow-y-scroll">
                <div className="flex flex-col items-center py-2 sm:flex-row sm:justify-between">
                    <div className="m-1">
                        <Logo />
                    </div>
                    <div className="m-1 flex items-center justify-center">
                        {user ? <SignOutButton onSignOut={onSignOut} /> : <SignInButton />}
                        <div
                            className="mx-1"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <SettingButton />
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="whitespace-nowrap text-2xl font-bold">モード選択{' : '}</div>
                    <div className="mt-2 flex max-w-4xl flex-wrap justify-center">
                        <ModeCard title="練習モード" explanation="意味と単語が表示されます" href="practice" />
                        <ModeCard
                            title="確認モード"
                            explanation={
                                <>
                                    意味のみ表示されます
                                    <br />
                                    間違えるとすぐに単語が表示されます
                                </>
                            }
                            href="/test"
                        />
                        <ModeCard
                            title="チャレンジモード"
                            explanation={
                                <>
                                    意味のみ表示されます
                                    <br />
                                    間違えても単語は表示されません
                                </>
                            }
                            href="challenge"
                        />
                        <ModeCard
                            title="採点モード"
                            explanation={
                                <>
                                    難易度はチャレンジモードと同じです
                                    <br />
                                    時間とタイプミスをカウントします
                                </>
                            }
                            href="/scoring"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
