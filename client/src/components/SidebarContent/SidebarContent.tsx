import { useSidebarTabs } from '@/hooks/useSidebarTabs';

export default function SidebarContent() {
  const { activeTabId, tabsList } = useSidebarTabs();
  const activeTab = tabsList.find(tab => tab.id === activeTabId);

  if (!activeTab) return null;

  const Component = activeTab.component;
  return <Component />;
}