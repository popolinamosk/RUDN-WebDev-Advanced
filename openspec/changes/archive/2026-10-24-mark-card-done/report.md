# Report: mark-card-done

## Что было сделано
Реализована возможность отмечать карточки как выполненные (тикеты KAN-4). Клиент может ставить и снимать отметку `isDone` через `PATCH /cards/:id`, значение сохраняется на сервере и переживает обновление страницы.

### Изменения в коде

**Сервер**
- `server/middleware/validateCardDone.ts` — middleware `validateCardDone`, проверяет что `req.body.isDone` имеет тип `boolean`, возвращает 400 при нарушении.
- `server/services/cards.service.ts` — функция `updateCardDone(cardId, isDone)`, находит карточку по id, обновляет `isDone`, возвращает карточку или `null`.
- `server/controllers/cards.controller.ts` — функция `patchCardDone(req, res)`, вызывает сервис, отвечает 404 если карточка не найдена, 200 с обновлённой карточкой иначе.
- `server/routes/cards.routes.ts` — строка `router.patch("/:id", validateCardDone, patchCardDone)`.

**Клиент**
- `client/src/api/cards.ts` — функция `updateCardDone(id, isDone)`, отправляет `PATCH /api/cards/:id` с телом `{ isDone }`.
- `client/src/components/BoardCard/BoardCard.tsx` — добавлен чекбокс и проп `onToggle`.
- `client/src/components/BoardColumn/BoardColumn.tsx` — добавлена `toggleMutation` через `useMutation`, передан `onToggle` в `BoardCard`.
- `client/src/components/BoardCard/BoardCard.module.css` — стили `.checkboxLabel` и `.checkbox`.

### Проверка
- `curl PATCH /api/cards/:id` с `{ isDone: "true" }` → 400
- `curl PATCH /api/cards/несуществующий-id` → 404
- На доске чекбокс ставит и снимает отметку
- Отметка сохраняется после F5

### Невыполненные задачи
- **5.3** — оптимистичное обновление UI не реализовано. Вместо него используется `invalidateQueries` через react-query после ответа сервера.
- **6.3** — фильтр «выполненные» не проверялся, так как отсутствует в текущей ветке и лежит в `feature/hide-done-filter`.
- **7.1** — `npm run build` не выполнен: сборка клиента падает из-за ранее существовавшей ошибки в `client/tsconfig.json`, не связанной с этим изменением.

## Статус
🟡 Частично завершено
