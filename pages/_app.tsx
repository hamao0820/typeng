import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PronounceProvider from '../Contexts/PronounceProvider';
import SoundEffectProvider from '../Contexts/SoundEffectProvider';
import TypingVolumeProvider from '../Contexts/TypingVolumeProvider';
import ListOpenStatesProvider from '../Contexts/ListOpenStatesProvider';
import { initializeFirebaseApp } from '../lib/firebase/firebase';
import AuthProvider from '../Contexts/AuthProvider';
import FavoritesProvider from '../Contexts/FavoritesProvider';
import TextSizeProvider from '../Contexts/TextSizeProvider';

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
