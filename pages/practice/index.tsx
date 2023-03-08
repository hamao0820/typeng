import Head from 'next/head';
import React from 'react';

import StageSelection from '../../components/StageSelection/StageSelection';

const PracticeHome = () => {
    return (
        <>
            <Head>
                <title>practice</title>
                <link rel="shortcut icon" href="favicons/favicon.ico" />
            </Head>
            <StageSelection mode="practice" />
        </>
    );
};

export default PracticeHome;
