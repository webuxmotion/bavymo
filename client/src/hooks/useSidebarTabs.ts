import { useTabsStore } from "@/store/useTabsStore";
import { tabsList } from "@/constants/tabsList";

export function useSidebarTabs() {
  const { sidebar, setSidebarActiveTabId } = useTabsStore();
  const activeTabId = sidebar.activeTabId || tabsList[0].id;

  return {
    activeTabId,
    setSidebarActiveTabId,
    tabsList,
  };
}