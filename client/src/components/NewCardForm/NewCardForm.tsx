import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../../api/cards";
import styles from "./NewCardForm.module.css";

export function NewCardForm() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setTitle("");
    },
    onError: (error) => {
      console.error("Ошибка при создании карточки:", error);
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }
    mutation.mutate(title);
  };

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        placeholder="Название карточки"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <button
        className={styles.button}
        type="button"
        onClick={handleSubmit}
      >
        Добавить
      </button>
    </div>
  );
}