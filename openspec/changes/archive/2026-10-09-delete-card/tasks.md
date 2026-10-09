# Tasks: delete-card

## 1. Добавить API-функцию удаления

- [x] 1.1 Добавить функцию `deleteCard(id: string)` в `client/src/api/cards.ts`, делающую DELETE-запрос на `/cards/${id}`.
- [ ] 1.2 Проверить, что функция бросает ошибку при `!response.ok` (по аналогии с `fetchCards` и `createCard`).

## 2. Обновить компонент карточки

- [x] 2.1 Добавить проп `onDelete?: () => void` в тип `BoardCardProps` в `client/src/components/BoardCard/BoardCard.tsx`.
- [x] 2.2 Деструктурировать `onDelete` из пропсов.
- [x] 2.3 Добавить кнопку удаления (`<button className={styles.deleteButton} onClick={onDelete}>×</button>`) в правый верхний угол карточки.
- [x] 2.4 Добавить в `BoardCard.module.css`:
  - `.card { position: relative; }`
  - `.deleteBtn { position: absolute; top: 4px; right: 4px; ... }`
  - `.deleteBtn:hover { ... }`

## 3. Добавить логику удаления в колонку

- [x] 3.1 Добавить `import { useMutation, useQueryClient }` в `BoardColumn.tsx`.
- [x] 3.2 Добавить `import { deleteCard }` из `../../api/cards`.
- [x] 3.3 Создать `const queryClient = useQueryClient()` внутри `BoardColumn`.
- [x] 3.4 Создать `const deleteMutation = useMutation({ mutationFn: deleteCard, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }) })`.
- [x] 3.5 Передать `onDelete={() => deleteMutation.mutate(card.id)}` в `<BoardCard>` при рендере.

## 4. Ручная проверка

- [ ] 4.1 Убедиться, что кнопка (×) видна на карточках.
- [ ] 4.2 Убедиться, что при клике карточка исчезает без перезагрузки страницы.
- [ ] 4.3 Обновить страницу (F5) и убедиться, что карточка не вернулась (запрос дошёл до сервера).
- [ ] 4.4 Убедиться, что удалённая выполненная карточка тоже удаляется.
