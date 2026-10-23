import styles from "./BoardCard.module.css";

type BoardCardProps = {
  title: string;
  isDone: boolean;
  onDelete?: () => void;
};

export function BoardCard({ title, isDone, onDelete }: BoardCardProps) {
  return (
    <div className={`${styles.card} ${isDone ? styles.done : ""}`}>
      {title}
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
