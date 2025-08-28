import { create } from "zustand";

type Sidebar = {
    activeTabId: string | undefined;
};

type TabsStore = {
    sidebar: Sidebar;
    setSidebarActiveTabId: (activeTabId: string) => void;
};

export const useTabsStore = create<TabsStore>((set) => ({
    sidebar: { activeTabId: undefined },
    setSidebarActiveTabId: (activeTabId) => {
        set({ sidebar: { activeTabId } });
    },
}));