# Design: delete-card

## Контекст

На доске нет способа удалить карточку. `BoardCard` — 9 строк, рендерит только `{title}`, без кнопок управления. `api/cards.ts` содержит `fetchCards` и `createCard`, но нет `deleteCard`. `BoardColumn` мапит карточки без обработчиков.

## Решение

### Архитектура

```
App.tsx
  │
  ├─ useQuery(["cards"]) → fetchCards()
  │
  └─ BoardColumn cards={cards}
       │
       ├─ deleteMutation = useMutation({
       │     mutationFn: deleteCard,
       │     onSuccess: () => invalidateQueries(["cards"])
       │   })
       │
       └─ cards.map(card =>
            <BoardCard
              title={card.title}
              onDelete={() => deleteMutation.mutate(card.id)}
            />
          )

BoardCard
  ├── props: { title, onDelete? }
  └── <button onClick={onDelete}>×</button>

api/cards.ts
  ├── fetchCards()     — GET /api/cards
  ├── createCard()     — POST /api/cards
  └── deleteCard(id)   — DELETE /api/cards/${id}  (новая)
```

### Реализация

#### 1. API: `deleteCard(id: string)`

```ts
export async function deleteCard(id: string): Promise<void> {
  const response = await fetch(`/api/cards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Не удалось удалить карточку");
}
```

- json-server поддерживает `DELETE /cards/:id` из коробки.
- Возвращает `void` — нам не нужно тело ответа.

#### 2. BoardCard: кнопка удаления

```tsx
type BoardCardProps = {
  title: string;
  onDelete?: () => void;
};

export function BoardCard({ title, onDelete }: BoardCardProps) {
  return (
    <div className={styles.card}>
      {title}
      {onDelete && (
        <button className={styles.deleteBtn} onClick={onDelete}>×</button>
      )}
    </div>
  );
}
```

- Кнопка `×` в правом верхнем углу через `position: absolute`.
- Рендерится только если передан `onDelete` — обратная совместимость.
- CSS: `.card` → `position: relative`, `.deleteBtn` → `position: absolute; top: 4px; right: 4px`.

#### 3. BoardColumn: мутация и обработчик

```tsx
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
            onDelete={() => deleteMutation.mutate(card.id)}
          />
        ))}
      </div>
    </section>
  );
}
```

- Паттерн идентичен `NewCardForm`: `useMutation` → `mutationFn` → `onSuccess` → `invalidateQueries`.
- `onDelete` передаётся как стрелочная функция с замыканием на `card.id`.

### CSS

```css
.card {
  /* существующие стили */
  position: relative;  /* добавить */
}

.deleteBtn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-muted);
  padding: 2px 6px;
  border-radius: 4px;
}

.deleteBtn:hover {
  background: var(--border);
  color: var(--text);
}
```

## Отклонённые варианты

### Вариант 1: Оптимистичное обновление UI

**Почему отклонено:** Мы ждём реального успешного ответа сервера перед удалением карточки из интерфейса. Оптимистичное обновление (мгновенное удаление из DOM до ответа сервера) даёт более быстрый UX, но при ошибках сети или сервера требует сложной логики отката (повторное добавление карточки, обработка ошибок). Текущий подход проще и надёжнее для MVP.

### Вариант 2: Модальное окно подтверждения удаления

**Почему отклонено:** Спека (Scenario: Успешное удаление карточки) требует мгновенного удаления без подтверждения — "при нажатии карточка исчезает". Модальное окно усложняет UX (дополнительный клик) и не требуется по спецификации.

### Вариант 3: Удаление через BoardCard мутацию

**Почему отклонено:** Размещение `useMutation` внутри `BoardCard` для каждой карточки создало бы N одинаковых мутаций. Перенос мутации в `BoardColumn` (родитель) даёт один экземпляр `deleteMutation` на все карточки, что проще и эффективнее.

## Зависимости

- `proposal.md` — определяет scope и требования.
- `specs/card-deletion/spec.md` — содержит REQ (кнопка удаления, удаление по запросу).
- `client/src/api/cards.ts` — файл для добавления `deleteCard`.
- `client/src/components/BoardCard/BoardCard.tsx` — файл для добавления кнопки.
- `client/src/components/BoardColumn/BoardColumn.tsx` — файл для добавления мутации.
- `client/src/components/NewCardForm/NewCardForm.tsx` — образец паттерна `useMutation`.
