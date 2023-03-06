import React, { FC, Fragment } from 'react';

import { Loading } from '../../types';

type Props = {
    isLoading: Loading;
};

const Spinner: FC<Props> = ({ isLoading }) => {
    return (
        <Fragment>
            {isLoading === 'loading' && (
                <div className="fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center">
                    <div className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50"></div>
                    <div className="flex justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Spinner;
