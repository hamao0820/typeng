import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PronounceProvider from '../Contexts/PronounceProvider';
import SoundEffectProvider from '../Contexts/SoundEffectProvider';
import TypingVolumeProvider from '../Contexts/TypingVolumeProvider';
import ListOpenStatesProvider from '../Contexts/ListOpenStatesProvider';
import { initializeFirebaseApp } from '../lib/firebase/firebase';
import AuthProvider from '../Contexts/AuthProvider';
import FavoritesProvider from '../Contexts/FavoritesProvider';

initializeFirebaseApp();
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <PronounceProvider>
            <SoundEffectProvider>
                <TypingVolumeProvider>
                    <ListOpenStatesProvider>
                        <AuthProvider>
                            <FavoritesProvider>
                                <Component {...pageProps} />
                            </FavoritesProvider>
                        </AuthProvider>
                    </ListOpenStatesProvider>
                </TypingVolumeProvider>
            </SoundEffectProvider>
        </PronounceProvider>
    );
}

export default MyApp;
