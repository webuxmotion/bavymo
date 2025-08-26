// components/Tooltip/Tooltip.tsx
import { type ReactNode, useState } from "react";
import styles from "./Tooltip.module.scss";

type TooltipProps = {
  children: ReactNode;
  content: string;
  delay?: number; // in milliseconds
};

export function Tooltip({ children, content, delay = 300 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisible(false);
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && <div className={styles.tooltip}>{content}</div>}
    </div>
  );
}