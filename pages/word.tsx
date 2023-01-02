import type { NextPage } from 'next';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AiFillSound } from 'react-icons/ai';
import { IoMdReturnLeft } from 'react-icons/io';

type Word = {
    id: number;
    en: string;
    ja: string;
};

const Word: NextPage = () => {
    const [data, setData] = useState<Word[]>([
        {
            id: 0,
            en: 'mathematic',
            ja: '数学',
        },
        {
            id: 1,
            en: 'car',
            ja: '車',
        },
        {
            id: 2,
            en: 'book',
            ja: '本',
        },
        {
            id: 3,
            en: 'science',
            ja: '科学',
        },
        {
            id: 4,
            en: 'water',
            ja: '水',
        },
        {
            id: 5,
            en: 'computer',
            ja: '計算機',
        },
    ]);
    const [id, setId] = useState<number>(Math.floor(Math.random() * (data.length + 1)));
    const [word, setWord] = useState<Word>({
        id: 0,
        en: 'mathematic',
        ja: '数学',
    });
    const [typed, setTyped] = useState<string>('');
    const [unTyped, setUnTyped] = useState<string>('');

    useEffect(() => {
        setWord(data[id]);
    }, [data, id]);

    useEffect(() => {
        setUnTyped(word.en);
        setTyped('');
    }, [word]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            const key = e.key;
            if (unTyped.startsWith(key)) {
                setUnTyped((prev) => prev.slice(1));
                setTyped((prev) => prev + key);
            }
        },
        [unTyped]
    );

    useEffect(() => {
        document.onkeydown = handleKeyDown;
    }, [handleKeyDown]);

    useEffect(() => {
        if (unTyped === '') {
            setId((prev) => {
                let next = Math.floor(Math.random() * data.length);
                while (next === prev) {
                    next = Math.floor(Math.random() * data.length);
                }
                return next;
            });
        }
    }, [data, typed, unTyped]);

    return (
        <div className="flex flex-col h-screen w-screen">
            <Link href={'/'}>
                <div className="flex items-center m-2">
                    <div className="p-2 bg-blue-300 w-fit rounded-md">
                        <IoMdReturnLeft size={'3rem'} />
                    </div>
                    <span className="text-lg font-bold">レベル選択に戻る</span>
                </div>
            </Link>
            <div className="flex justify-center items-center h-4/5">
                <div className="flex h-fit w-1/4 justify-start">
                    <div className="p-2 bg-green-500 w-fit rounded-md">
                        <AiFillSound size={'10em'} />
                    </div>
                    <div className="flex flex-col justify-between ml-5">
                        <div className="">
                            <span className="text-5xl font-bold">{word?.ja}</span>
                        </div>
                        <div className="">
                            <span className="text-8xl font-bold">{typed}</span>
                            <span className="text-8xl font-bold text-gray-300">{unTyped}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Word;
