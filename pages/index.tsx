import type { NextPage } from 'next';
import { forwardRef, useState } from 'react';
import ModeCard from '../components/ModeSelection/ModeCard';
import Logo from '../components/ModeSelection/Logo';
import SettingButton from '../components/Setting/SettingButton';
import Head from 'next/head';
import SignInButton from '../components/ModeSelection/SignInButton';
import { useAuthContext } from '../Contexts/AuthProvider';
import SignOutButton from '../components/ModeSelection/SignOutButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

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
        <div className="flex flex-col h-screen">
            <Head>
                <title>Typeng</title>
                <link rel="icon" href="favicons/favicon.ico" />
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
            <div className="flex justify-center items-center h-1/5 relative">
                <Logo />
                <div
                    className="absolute top-2 right-2 m-2"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <SettingButton />
                </div>
                <div className="absolute top-0 right-20">
                    {user ? <SignOutButton onSignOut={onSignOut} /> : <SignInButton />}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center h-4/5">
                <div className="text-2xl font-bold">モード選択{' : '}</div>
                <div className="flex flex-wrap w-1/2 justify-center mt-2">
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
    );
};

export default Home;
