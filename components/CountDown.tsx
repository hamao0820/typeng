import React, { useEffect, useState } from 'react';

type Props = {
    ready: boolean;
    setReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const CountDown: React.FC<Props> = ({ ready, setReady }) => {
    const [countTime, setCountTime] = useState<number>(2);
    const [counting, setCounting] = useState<boolean>(false);
    useEffect(() => {
        window.onkeydown = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            if (e.code === 'Space') {
                setCounting(true);
            }
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountTime((count) => {
                if (!counting) {
                    clearInterval(timer);
                    return count;
                }
                if (count === 0) {
                    clearInterval(timer);
                    setCounting(false);
                    setReady(true);
                    return 0;
                }
                return count - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countTime, counting, ready, setReady]);
    return (
        <>
            (
            <div
                className="h-screen w-screen absolute top-0 left-0 bg-white z-50 flex flex-col justify-center items-center"
                onKeyDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="text-9xl">{countTime + 1}</div>
                <div className={counting ? 'text-3xl invisible' : 'text-3xl'}>スペースキーで開始</div>
            </div>
            )
        </>
    );
};

export default CountDown;
