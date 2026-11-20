# Tasks: server-side done filter

## 1. Репозиторий — findAll(isDone?)

- [x] 1.1 В `server/repositories/cards.repository.ts` изменить сигнатуру `findAll` на `findAll(isDone?: boolean)`.
- [x] 1.2 При `isDone !== undefined` добавить `WHERE is_done = $1` и передать `[isDone]` как второй аргумент `pool.query`.
- [x] 1.3 При `isDone === undefined` выполнить исходный запрос без `WHERE`.
- [x] 1.4 Убедиться, что `isDone` попадает в SQL только через `$1` — проверить поиск `${` по проекту не даёт новых вставок.

## 2. Сервис — getAll(isDone?)

- [x] 2.1 В `server/services/cards.service.ts` изменить сигнатуру `getAll` на `getAll(isDone?: boolean)`.
- [x] 2.2 Передать `isDone` в `cardsRepository.findAll(isDone)`.

## 3. Контроллер — разбор параметра done

- [x] 3.1 В `server/controllers/cards.controller.ts` прочитать `req.query.done`.
- [x] 3.2 Валидировать: `undefined` → `isDone = undefined`, `"true"` → `isDone = true`, `"false"` → `isDone = false`.
- [x] 3.3 Любое другое значение → `res.status(400).json({ error: "..." })` и `return`.
- [x] 3.4 Вызвать `cardsService.getAll(isDone)` и ответить 200 с результатом.

## 4. Клиент — fetchCards(hideDone)

- [x] 4.1 В `client/src/api/cards.ts` изменить `fetchCards` на `fetchCards(hideDone?: boolean)`.
- [x] 4.2 При `hideDone === true` добавить параметр `done=false` к URL (`/api/cards?done=false`).
- [x] 4.3 При `hideDone === false` или `undefined` запрос к `/api/cards` без параметров.
- [x] 4.4 В `client/src/App.tsx` создать стор `useBoardFiltersStore` с состоянием `hideDone` и функцией `toggleHideDone`.
- [x] 4.5 Включить `hideDone` в ключ `useQuery`: `queryKey: ["cards", hideDone]`.
- [x] 4.6 Передать `hideDone` в `queryFn: () => fetchCards(hideDone)`.
- [x] 4.7 Убедиться, что при пустом ответе сервера (`[]`) доска показывает пустую колонку, а не сообщение об ошибке загрузки (React Query возвращает пустой массив, `BoardColumn` рендерит пустой `div.cards`).

## 5. Проверка критериев приёмки

- [x] 5.1 **Network:** открыть DevTools → Network, переключить фильтр «скрыть выполненные», убедиться, что запрос уходит на сервер с `?done=false` и без параметра.
- [x] 5.2 **400 на негодное значение:** curl `GET /api/cards?done=1` → код 400, ответ JSON.
- [x] 5.3 **Пустой список:** создать карточку, отметить выполненной, включить фильтр → сервер отвечает 200 `[]`, колонка пустая.
- [x] 5.4 **Поиск `${` по проекту:** `grep -r '${' server/repositories/ server/services/ server/controllers/` — убедиться, что значение `isDone` не склеивается в строку SQL.

## 6. Архивация

- [ ] 6.1 Запустить `npm run build` — без ошибок компиляции.
- [ ] 6.2 Визуально проверить все сценарии из критериев приёмки.
- [ ] 6.3 Архивировать изменение.
- [ ] 6.4 Создать `report.md` по истории коммитов ветки.
