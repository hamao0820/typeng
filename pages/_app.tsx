import '../styles/globals.css';

import type { AppProps } from 'next/app';

import AuthProvider from '../Contexts/AuthProvider';
import FavoritesProvider from '../Contexts/FavoritesProvider';
import ListOpenStatesProvider from '../Contexts/ListOpenStatesProvider';
import PronounceProvider from '../Contexts/PronounceProvider';
import SoundEffectProvider from '../Contexts/SoundEffectProvider';
import TextSizeProvider from '../Contexts/TextSizeProvider';
import TypingVolumeProvider from '../Contexts/TypingVolumeProvider';
import { initializeFirebaseApp } from '../lib/firebase/firebase';

initializeFirebaseApp();
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <PronounceProvider>
            <SoundEffectProvider>
                <TypingVolumeProvider>
                    <ListOpenStatesProvider>
                        <AuthProvider>
                            <FavoritesProvider>
                                <TextSizeProvider>
                                    <Component {...pageProps} />
                                </TextSizeProvider>
                            </FavoritesProvider>
                        </AuthProvider>
                    </ListOpenStatesProvider>
                </TypingVolumeProvider>
            </SoundEffectProvider>
        </PronounceProvider>
    );
}

export default MyApp;
