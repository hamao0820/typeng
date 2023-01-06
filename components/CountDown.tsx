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
        const timer = setInterval(() => {
            setCountTime((count) => {
                if (!counting) {
                    clearInterval(timer);
                    return count;
                }
                if (count === 1) {
                    clearInterval(timer);
                    setReady(true);
                    setCounting(false);
                }
                return count - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countTime, counting, ready, setReady]);
    return (
        <>
            {!ready && (
                <div
                    className="h-screen w-screen absolute top-0 left-0 bg-white z-50 flex flex-col justify-center items-center"
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="text-9xl">{countTime}</div>
                    {!counting && <div className="text-3xl">スペースキーで開始</div>}
                </div>
            )}
        </>
    );
};

export default CountDown;
