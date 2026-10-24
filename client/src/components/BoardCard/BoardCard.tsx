import styles from "./BoardCard.module.css";

type BoardCardProps = {
  title: string;
  isDone: boolean;
  onDelete?: () => void;
  onToggle?: () => void;
};

export function BoardCard({ title, isDone, onDelete, onToggle }: BoardCardProps) {
  return (
    <div className={`${styles.card} ${isDone ? styles.done : ""}`}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isDone}
          onChange={onToggle}
          className={styles.checkbox}
        />
        {title}
      </label>
      {onDelete && (
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          type="button"
          aria-label="Удалить карточку"
        >
          ×
        </button>
      )}
    </div>
  );
}
