import { useContext } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PronounceProvider from '../Contexts/PronounceProvider';
import SoundEffectProvider from '../Contexts/SoundEffectProvider';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <PronounceProvider>
            <SoundEffectProvider>
                <Component {...pageProps} />
            </SoundEffectProvider>
        </PronounceProvider>
    );
}

export default MyApp;
