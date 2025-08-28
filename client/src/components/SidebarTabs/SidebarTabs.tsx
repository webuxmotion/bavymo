import { useSidebarTabs } from '@/hooks/useSidebarTabs';
import styles from './SidebarTabs.module.scss';
import clsx from 'clsx';

export default function SidebarTabs() {
  const { activeTabId, setSidebarActiveTabId, tabsList } = useSidebarTabs();

  return (
    <div className={styles.sidebarTabs}>
      {tabsList.map(item => (
        <button
          key={item.id}
          className={clsx(
            styles.button,
            activeTabId === item.id && styles.active
          )}
          onClick={() => setSidebarActiveTabId(item.id)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}
