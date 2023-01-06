import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PronounceProvider from '../Contexts/PronounceProvider';
import SoundEffectProvider from '../Contexts/SoundEffectProvider';
import TypingVolumeProvider from '../Contexts/TypingVolumeProvider';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <PronounceProvider>
            <SoundEffectProvider>
                <TypingVolumeProvider>
                    <Component {...pageProps} />
                </TypingVolumeProvider>
            </SoundEffectProvider>
        </PronounceProvider>
    );
}

export default MyApp;
