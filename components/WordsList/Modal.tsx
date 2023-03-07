import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import React, { FC, ReactNode } from 'react';

type Props = {
    children: ReactNode;
    isOpen: boolean;
    close: () => void;
};

const Modal: FC<Props> = ({ children, isOpen, close }) => {
    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center">
                    <div className="fixed top-0 left-0 h-full w-full bg-black opacity-50" onClick={close}></div>
                    <Fade in={isOpen}>
                        <div className="z-20 flex h-5/6 w-5/6 flex-col rounded-md bg-white">
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
