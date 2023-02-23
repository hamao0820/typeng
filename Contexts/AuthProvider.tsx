import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@firebase/auth';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

export type GlobalAuthState = {
    user: User | null | undefined;
};
const initialState: GlobalAuthState = {
    user: undefined,
};
const AuthContext = createContext<GlobalAuthState>(initialState);

type Props = { children: ReactNode };

const AuthProvider: FC<Props> = ({ children }) => {
    const [user, setUser] = useState<GlobalAuthState>(initialState);
    useEffect(() => {
        try {
            const auth = getAuth();
            return onAuthStateChanged(auth, (user) => {
                setUser({
                    user,
                });
            });
        } catch (error) {
            setUser(initialState);
            throw error;
        }
    }, []);
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
