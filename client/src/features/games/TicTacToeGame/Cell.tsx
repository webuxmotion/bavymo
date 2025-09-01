import clsx from "clsx";
import Cross from "./icons/Cross";
import Zero from "./icons/Zero";
import styles from "./Cell.module.scss";
import type { SymbolType } from "./gameUtils";

type CellProps = {
  index: number;
  symbol?: SymbolType;
  disabled?: boolean;
  onClick: (index: number) => void;
};

export default function Cell({ index, symbol, disabled = false, onClick }: CellProps) {
  return (
    <div
      className={clsx(styles.cell, symbol && styles.unavailable)}
      onClick={() => !disabled && onClick(index)}
    >
      <span>
        {symbol === "cross" && <Cross />}
        {symbol === "zero" && <Zero />}
      </span>
    </div>
  );
}