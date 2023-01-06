import type { NextPage } from 'next';
import ModeCard from '../components/ModeCard';
import Logo from '../components/Logo';
import SettingButton from '../components/SettingButton';

const Home: NextPage = () => {
    return (
        <div className="flex flex-col h-screen relative">
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
                    <ModeCard title="練習モード" explanation="意味 と 単語" href="practice" />
                    <ModeCard
                        title="確認モード"
                        explanation={
                            <>
                                意味 のみ <br />
                                間違えた時に単語が表示されます
                            </>
                        }
                        href="/test"
                    />
                    <ModeCard title="チャレンジモード" explanation="意味 のみ" href="challenge" />
                    <ModeCard
                        title="テストモード"
                        explanation={
                            <>
                                意味 のみ <br />
                                時間と正確性を競います
                            </>
                        }
                        href="/"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
