import type { NextPage } from 'next';
import ModeCard from '../components/ModeCard';
import Logo from '../components/Logo';
import SettingButton from '../components/SettingButton';
import Head from 'next/head';

// TODO: icoを用意
const Home: NextPage = () => {
    return (
        <div className="flex flex-col h-screen relative">
            <Head>
                <title>Typeng</title>
            </Head>
            <div className="flex justify-center items-center h-1/5">
                <Logo />
                <div
                    className="absolute top-2 right-2 m-2"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <SettingButton />
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
