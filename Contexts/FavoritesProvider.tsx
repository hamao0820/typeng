import { getDatabase, onValue,ref } from '@firebase/database';
import { FirebaseError } from 'firebase/app';
import path from 'path';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

import { Favorites } from '../types/favorite';
import { useAuthContext } from './AuthProvider';

type Props = {
    children: ReactNode;
};

const favoritesContext = createContext<Favorites>([]);

const FavoritesProvider: FC<Props> = ({ children }) => {
    const [favorites, setFavorites] = useState<Favorites>([]);
    const { user } = useAuthContext();
    useEffect(() => {
        if (!user) return;
        try {
            const db = getDatabase();
            const favoritesRef = ref(db, path.join('user', user.uid, 'favorites'));
            onValue(favoritesRef, (snapshot) => {
                const value = snapshot.val();
                setFavorites(value ? value : []);
            });
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
            }
            return;
        }
    }, [user]);
    return <favoritesContext.Provider value={favorites}>{children}</favoritesContext.Provider>;
};
export const useFavoritesContext = () => useContext(favoritesContext);
export default FavoritesProvider;
