import React, { useEffect, useState } from 'react';

type Props = {
    ready: boolean;
    setReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const CountDown: React.FC<Props> = ({ ready, setReady }) => {
    const [countTime, setCountTime] = useState<number>(3);
    const [counting, setCounting] = useState<boolean>(false);
    useEffect(() => {
        window.onkeydown = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            if (e.code === 'Space') {
                setCounting(true);
            }
        };
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
            (
            <div
                className="h-screen w-screen absolute top-0 left-0 bg-white z-50 flex flex-col justify-center items-center"
                onKeyDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="text-9xl">{countTime}</div>
                <div className={counting ? 'text-3xl invisible' : 'text-3xl'}>スペースキーで開始</div>
            </div>
            )
        </>
    );
};

export default CountDown;
