import Head from 'next/head';
import React from 'react';

import StageSelection from '../../components/StageSelection/StageSelection';

const ChallengeHome = () => {
    return (
        <>
            <Head>
                <title>challenge</title>
                <link rel="shortcut icon" href="favicons/favicon.ico" />
            </Head>
            <StageSelection mode="challenge" />
        </>
    );
};

export default ChallengeHome;
