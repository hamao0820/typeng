import React, { FC, Fragment } from 'react';
import { Loading } from '../types';

type Props = {
    isLoading: Loading;
};

const Spinner: FC<Props> = ({ isLoading }) => {
    return (
        <Fragment>
            {isLoading === 'loading' && (
                <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-10">
                    <div className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50"></div>
                    <div className="flex justify-center">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Spinner;
