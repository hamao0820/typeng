import Head from 'next/head';
import React from 'react';

import StageSelection from '../../components/StageSelection/StageSelection';

const ChallengeHome = () => {
    return (
        <>
            <Head>
                <title>challenge</title>
            </Head>
            <StageSelection mode="challenge" />
        </>
    );
};

export default ChallengeHome;
