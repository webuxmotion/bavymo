/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export type User = {
    personalCode: string
}

export type AppContextType = {
    user: User;
    setUser: (user: User) => void;
    token: string;
    setToken: (t: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState({
        personalCode: ""
    });
    const [token, setToken] = useState("");

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be inside AppProvider");
    return context;
}