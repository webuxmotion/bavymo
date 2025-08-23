/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { createSetters } from "./app-setters";
import type { Call } from "@/features/call/callTypes";
import { initialCallData } from "@/features/call/initialCallData";
import type { createCallSetters } from "@/features/call/call-setters";

type Data = {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    call: Call
}

export type User = {
    personalCode: string
}

export type AppContextType = {
    user: User;
    setUser: (user: User) => void;
    token: string;
    setToken: (t: string) => void;
    data: Data;
    setData: React.Dispatch<React.SetStateAction<Data>>;
    setLocalStream: (stream: MediaStream | null) => void;
    setRemoteStream: (stream: MediaStream | null) => void;
    callSetters: ReturnType<typeof createCallSetters>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState({
        personalCode: ""
    });
    const [token, setToken] = useState("");
    const [data, setData] = useState<Data>({
        localStream: null,
        remoteStream: null,
        call: initialCallData
    });

    const { setLocalStream, setRemoteStream, callSetters } = createSetters(setData);

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
            data,
            setData,
            setLocalStream,
            setRemoteStream,
            callSetters
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