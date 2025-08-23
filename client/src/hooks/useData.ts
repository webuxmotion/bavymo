import { useAppContext } from "@/providers/AppProvider";

export function useData() {
    const { data } = useAppContext();
    return data;
}