import React, { useEffect, useState } from 'react';

import FavoriteHeader from '../Favorites/FavoriteHeader';

type Props = {
    setReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const FavoriteCountDown: React.FC<Props> = ({ setReady }) => {
    const [countTime, setCountTime] = useState<number>(3);
    const [counting, setCounting] = useState<boolean>(false);
    useEffect(() => {
        const onkeydown = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            if (e.code === 'Space') {
                setCounting(true);
            }
        };
        window.addEventListener('keydown', onkeydown);
        return () => window.removeEventListener('keydown', onkeydown);
    }, []);

    useEffect(() => {
        if (countTime === 0) {
            setCounting(false);
            setReady(true);
            return;
        }
        const timer = setInterval(() => {
            setCountTime((count) => {
                if (!counting) {
                    clearInterval(timer);
                    return count;
                }
                return count - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countTime, counting, setReady]);
    return (
        <>
            <div className="absolute z-20 w-screen">
                <FavoriteHeader text="選択画面に戻る" href="/scoring" mode="scoring" />
            </div>
            <div
                className="h-screen w-screen absolute top-0 left-0 bg-white z-10 flex flex-col justify-center items-center"
                onKeyDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="text-9xl">{countTime}</div>
                <div className={counting ? 'text-3xl invisible' : 'text-3xl'}>スペースキーで開始</div>
            </div>
        </>
    );
};

export default FavoriteCountDown;
