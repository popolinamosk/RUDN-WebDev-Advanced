import { useBoardFiltersStore } from "../../store/useBoardFiltersStore";
import styles from "./BoardHeader.module.css";

export function BoardHeader() {
  const hideDone = useBoardFiltersStore((s) => s.hideDone);
  const toggleHideDone = useBoardFiltersStore((s) => s.toggleHideDone);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Канбан-доска</h1>
      <div className={styles.controls}>
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            checked={hideDone}
            onChange={toggleHideDone}
          />
          Скрыть выполненные
        </label>
      </div>
    </header>
  );
}
