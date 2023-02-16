import React, { FC, ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';

type Props = {
    children: ReactNode;
    isOpen: boolean;
    close: () => void;
};

const Modal: FC<Props> = ({ children, isOpen, close }) => {
    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-10">
                    <div className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50" onClick={close}></div>
                    <Fade in={isOpen}>
                        <div className="z-20 w-5/6 h-5/6 bg-white flex flex-col rounded-md">
                            <div className="m-2">
                                <CloseIcon
                                    onClick={close}
                                    className="cursor-pointer hover:bg-gray-100"
                                    fontSize="large"
                                />
                            </div>
                            <div className="flex-1 overflow-hidden">{children}</div>
                        </div>
                    </Fade>
                </div>
            )}
        </>
    );
};

export default Modal;
