import { getDatabase, ref, remove,set } from '@firebase/database';
import { FirebaseError } from '@firebase/util';
import path from 'path';

import { useAuthContext } from '../Contexts/AuthProvider';
import { useFavoritesContext } from '../Contexts/FavoritesProvider';
import { Word } from '../types';

const useFavorites = () => {
    const favorites = useFavoritesContext();
    const { user } = useAuthContext();
    const addToFavorites = async (word: Word) => {
        if (!user) return;
        try {
            const db = getDatabase();
            const favoritesRef = ref(db, path.join('user', user.uid, 'favorites'));
            if (favorites.length === 0) {
                await set(favoritesRef, [word.id]);
            } else {
                await set(favoritesRef, Array.from(new Set([...favorites, word.id])));
            }
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
            }
        }
    };
    const removeFromFavorites = async (word: Word) => {
        if (!user) return;
        try {
            const db = getDatabase();
            const favoritesRef = ref(db, path.join('user', user.uid, 'favorites'));
            const removedFavorites = favorites.filter((id) => id !== word.id);
            if (removedFavorites.length === 0) {
                await remove(ref(db, path.join('user', user.uid, 'favorites', '0')));
            } else {
                await set(favoritesRef, removedFavorites);
            }
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
            }
        }
    };
    return { addToFavorites, removeFromFavorites, favorites };
};

export default useFavorites;
