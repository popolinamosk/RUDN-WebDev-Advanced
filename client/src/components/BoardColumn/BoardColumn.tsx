import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCard } from "../../api/cards";
import { BoardCard } from "../BoardCard/BoardCard";
import type { Card } from "../../types/card";
import styles from "./BoardColumn.module.css";

type BoardColumnProps = {
  cards: Card[];
};

export function BoardColumn({ cards }: BoardColumnProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return (
    <section className={styles.column}>
      <h2 className={styles.title}>К выполнению</h2>
      <div className={styles.cards}>
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            title={card.title}
            isDone={card.isDone}
            onDelete={() => deleteMutation.mutate(card.id)}
          />
        ))}
      </div>
    </section>
  );
}
