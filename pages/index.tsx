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
            <div className="flex flex-col justify-center items-center h-3/5">
                <div className="text-2xl font-bold">モード選択{' : '}</div>
                <div className="flex">
                    <ModeCard title="単語付き" explanation="訳と単語が同時に表示されます" href="word" />
                    <ModeCard
                        title="訳のみ"
                        explanation="訳のみが表示されます. 間違えた時に単語が表示されます"
                        href="/"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
