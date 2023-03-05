import React, { FC, useContext } from 'react';
import { pronounce } from '../../utils';
import { Word } from '../../types';
import { pronounceVolumeContext } from '../../Contexts/PronounceProvider';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
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
    const pronounceVolume = useContext(pronounceVolumeContext);
    return (
        <div className="w-screen h-full">
            <div className="flex justify-end w-screen my-6">
                {progress && <div className="text-5xl whitespace-nowrap mx-10">{progress}</div>}
                <div className="flex justify-between items-center w-32 mr-28">
                    <div>{word && !progress && <FavoriteStar word={word} />}</div>
                    <div className="text-5xl whitespace-nowrap">id: {word && word.id}</div>
                </div>
            </div>
            <div className="flex h-fit justify-start w-full ml-3 mt-16">
                <div
                    className="w-fit h-fit flex items-center justify-center bg-green-500 rounded-md"
                    onClick={() => {
                        if (word === null) return;
                        pronounce(word.en, pronounceVolume);
                    }}
                >
                    <VolumeUpIcon sx={{ height: '40vh', width: '40vh', minHeight: '200px', minWidth: '200px' }} />
                </div>
                <div className="flex flex-col justify-between mx-2 flex-1">
                    <div className="line-clamp-2">
                        <div
                            className="text-8xl font-bold line-clamp-2 tracking-tighter"
                            style={{ lineHeight: '100px' }}
                        >
                            {word && word.ja}
                        </div>
                    </div>
                    <div className="whitespace-nowrap">
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
