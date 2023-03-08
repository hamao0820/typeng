import Head from 'next/head';
import React from 'react';

import StageSelection from '../../components/StageSelection/StageSelection';

const TestHome = () => {
    return (
        <>
            <Head>
                <title>test</title>
                <link rel="shortcut icon" href="favicons/favicon.ico" />
            </Head>
            <StageSelection mode="test" />
        </>
    );
};

export default TestHome;
