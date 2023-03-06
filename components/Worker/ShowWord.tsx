import React, { FC, useMemo } from 'react';

import { useTextSizeContext } from '../../Contexts/TextSizeProvider';
import { Word } from '../../types';
import FavoriteStar from '../Favorites/FavoriteStar';

type Props = {
    word: Word | null;
    typed: string;
    unTyped: string;
    showUnTyped?: boolean;
    showHint?: boolean;
    progress?: `${number} / ${number}`;
};

const ShowWord: FC<Props> = ({ word, typed, unTyped, showUnTyped = true, showHint = false, progress }) => {
    const { textSize } = useTextSizeContext();
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
    return (
        <div className="w-screen">
            <div className="flex justify-end w-full my-6">
                {progress && <div className="text-5xl whitespace-nowrap mx-10">{progress}</div>}
                <div className="flex justify-between items-center w-32 mr-28">
                    <div>{word && !progress && <FavoriteStar word={word} />}</div>
                    <div className="text-5xl whitespace-nowrap">id: {word && word.id}</div>
                </div>
            </div>
            <div className="flex justify-center w-full">
                <div className="flex flex-col justify-between items-center w-full">
                    <div className="h-52 mx-1">
                        <div
                            className={`${textSizeClassName} font-bold line-clamp-2 tracking-tighter text-center`}
                            style={{ lineHeight: '100px' }}
                        >
                            {word && word.ja}
                        </div>
                    </div>
                    <div className="whitespace-nowrap flex items-center justify-center w-5/6 h-20 border-b-4 border-collapse border-gray-300 my-2">
                        <span className="text-7xl font-bold whitespace-nowrap">{typed.replaceAll(' ', '␣')}</span>
                        {showUnTyped ? (
                            <span className="text-7xl font-bold text-gray-300 whitespace-nowrap">
                                {unTyped.replaceAll(' ', '␣')}
                            </span>
                        ) : (
                            <>
                                {showHint ? (
                                    <>
                                        <span className="text-7xl font-bold text-gray-300 whitespace-nowrap">
                                            {unTyped.replaceAll(' ', '␣')[0]}
                                        </span>
                                        <span
                                            className="text-7xl font-bold text-gray-300 whitespace-nowrap"
                                            style={{ display: 'none' }}
                                        >
                                            {unTyped.replaceAll(' ', '␣').slice(1)}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className="text-7xl font-bold text-gray-300 whitespace-nowrap"
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
