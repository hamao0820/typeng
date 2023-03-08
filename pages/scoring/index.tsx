import Head from 'next/head';
import React from 'react';

import StageSelection from '../../components/StageSelection/StageSelection';

const ScoringHome = () => {
    return (
        <>
            <Head>
                <title>scoring</title>
                <link rel="shortcut icon" href="favicons/favicon.ico" />
            </Head>
            <StageSelection mode="scoring" />
        </>
    );
};

export default ScoringHome;
