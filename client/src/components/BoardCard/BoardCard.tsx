import styles from "./BoardCard.module.css";

type BoardCardProps = {
  title: string;
  onDelete?: () => void;
};

export function BoardCard({ title, onDelete }: BoardCardProps) {
  return (
    <div className={styles.card}>
      {title}
      {onDelete && (
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}
