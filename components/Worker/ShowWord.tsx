import React, { FC, useContext, useEffect, useMemo } from 'react';

import { pronounceVolumeContext } from '../../Contexts/PronounceProvider';
import { useTextSizeContext } from '../../Contexts/TextSizeProvider';
import { Word } from '../../types';
import { pronounce } from '../../utils';
import FavoriteStar from '../Favorites/FavoriteStar';

type Props = {
    word: Word | null;
    typed: string;
    unTyped: string;
    showUnTyped?: boolean;
    showHint?: boolean;
    progress?: `${number} / ${number}`;
    canPronounce?: boolean;
};

const ShowWord: FC<Props> = ({
    word,
    typed,
    unTyped,
    showUnTyped = true,
    showHint = false,
    progress,
    canPronounce = true,
}) => {
    const { textSize } = useTextSizeContext();
    const pronounceVolume = useContext(pronounceVolumeContext);
    const textSizeClassName = useMemo(() => {
        switch (textSize) {
            case 'large':
                return 'text-8xl';
            case 'middle':
                return 'text-7xl';
            case 'small':
                return 'text-6xl';
            default:
                return 'text-8xl';
        }
    }, [textSize]);

    useEffect(() => {
        if (word === null) return;
        const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
            if ((e.altKey || e.metaKey || e.ctrlKey) && e.key === 'Enter' && canPronounce) {
                pronounce(word.en, pronounceVolume / 100);
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [pronounceVolume, word, canPronounce]);

    return (
        <div className="w-screen">
            <div className="my-6 flex w-full justify-end">
                {progress && <div className="mx-10 whitespace-nowrap text-5xl">{progress}</div>}
                <div className="mr-28 flex w-32 items-center justify-between">
                    <div>{word && !progress && <FavoriteStar word={word} />}</div>
                    <div className="whitespace-nowrap text-5xl">id: {word && word.id}</div>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <div className="flex w-full flex-col items-center justify-between">
                    <div className="mx-1 h-52">
                        <div
                            className={`${textSizeClassName} text-center font-bold tracking-tighter line-clamp-2`}
                            style={{ lineHeight: '100px' }}
                        >
                            {word && word.ja}
                        </div>
                    </div>
                    <div
                        className="my-2 flex h-20 w-5/6 border-collapse cursor-pointer items-center justify-center whitespace-nowrap border-b-4 border-gray-300"
                        onClick={() => word && pronounce(word.en, pronounceVolume / 100)}
                    >
                        <span className="whitespace-nowrap text-7xl font-bold">{typed.replaceAll(' ', '␣')}</span>
                        {showUnTyped ? (
                            <span className="whitespace-nowrap text-7xl font-bold text-gray-300">
                                {unTyped.replaceAll(' ', '␣')}
                            </span>
                        ) : (
                            <>
                                {showHint ? (
                                    <>
                                        <span className="whitespace-nowrap text-7xl font-bold text-gray-300">
                                            {unTyped.replaceAll(' ', '␣')[0]}
                                        </span>
                                        <span
                                            className="whitespace-nowrap text-7xl font-bold text-gray-300"
                                            style={{ display: 'none' }}
                                        >
                                            {unTyped.replaceAll(' ', '␣').slice(1)}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className="whitespace-nowrap text-7xl font-bold text-gray-300"
                                        style={{ display: 'none' }}
                                    >
                                        {unTyped.replaceAll(' ', '␣')}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowWord;
