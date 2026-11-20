# Report: server-side-filter

## Что сделано

### Агент (открытый код)

#### Блок 1 — Репозиторий
- Изменён `server/repositories/cards.repository.ts`: функция `findAll()` → `findAll(isDone?: boolean)`.
- При `isDone !== undefined` добавлено условие `WHERE is_done = $1` с параметром `[isDone]`.
- При `isDone === undefined` — исходный запрос без `WHERE`.
- Значение `isDone` попадает в SQL только через `$1`, склейка строк отсутствует.

#### Блок 2 — Сервис
- Изменён `server/services/cards.service.ts`: функция `getAll()` → `getAll(isDone?: boolean)`.
- Параметр пробрасывается в `cardsRepository.findAll(isDone)`.
- Никакой фильтрации или SQL в сервисе нет.

#### Блок 3 — Контроллер
- Изменён `server/controllers/cards.controller.ts`: функция `getCards`.
- Читает `req.query.done`, валидирует: `undefined` → без фильтра, `"true"` → `isDone=true`, `"false"` → `isDone=false`, всё остальное → 400 с JSON `{ error: "..." }`.
- Вызывает `cardsService.getAll(isDone)`, отвечает 200 с массивом карточек.
- Никакой фильтрации карточек в контроллере нет.

#### Блок 4 — Клиент
- Установлен пакет `zustand` в `client/package.json`.
- Создан `client/src/store/useBoardFiltersStore.ts` — стор с `hideDone: boolean` и `toggleHideDone()`.
- Изменён `client/src/api/cards.ts`: `fetchCards()` → `fetchCards(hideDone?: boolean)`. При `hideDone=true` добавляет `?done=false`, при `hideDone=false` — запрос без параметров.
- Изменён `client/src/App.tsx`: `hideDone` берётся из стора, `queryKey: ["cards", hideDone]`, `queryFn: () => fetchCards(hideDone)`.
- Изменён `client/src/components/BoardHeader/BoardHeader.tsx`: добавлен чекбокс «Скрыть выполненные» через стор.
- Клиентская фильтрация карточек по `isDone` отсутствует — `BoardColumn` рендерит все переданные карточки.

### Человек (правки руками)
- Правок не вносил.

## Как проверить

### Запуск
```bash
npm run dev   # в корне проекта (сервер + клиент)
```

### Проверка критериев приёмки

#### Критерий 1: Состояние переключателя уходит на сервер параметром строки запроса
1. Открыть DevTools → Network.
2. Включить фильтр «Скрыть выполненные».
3. Убедиться, что запрос уходит на `/api/cards?done=false`.

**Результат:** ✅ Пройдено.

#### Критерий 2: Отбор карточек делает база условием внутри SQL-запроса
1. Открыть `server/repositories/cards.repository.ts`.
2. Убедиться, что `WHERE is_done = $1` присутствует только при `isDone !== undefined`.
3. Проверить, что `getAll` и `getCards` не вызывают `.filter()` по `isDone`.

**Результат:** ✅ Пройдено.

#### Критерий 3: Переключение фильтра приводит к новому запросу
1. Переключить чекбокс в `BoardHeader`.
2. Убедиться, что `queryKey: ["cards", hideDone]` меняется и React Query делает новый запрос.

**Результат:** ✅ Пройдено.

#### Критерий 4: Негодное значение параметра → 400
```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/cards?done=1"
# 400
curl -s "http://localhost:3000/api/cards?done=1"
# {"error":"Параметр \"done\" должен быть \"true\" или \"false\""}
```

**Результат:** ✅ Пройдено.

#### Критерий 5: Пустой список → 200 и пустая колонка
1. Отметить все карточки выполненными.
2. Включить фильтр «Скрыть выполненные».
3. Сервер отвечает 200 с `[]`.
4. Доска показывает пустую колонку, без ошибки.

**Результат:** ✅ Пройдено.

#### Критерий 6: Значение параметра через $1, без склейки строк
```bash
grep -r '${' server/repositories/ server/services/ server/controllers/
# Не должно быть совпадений с SQL-запросами
```

**Результат:** ✅ Пройдено. `${` в SQL-строках не найден.

#### Критерий 7: Без параметра — без условия WHERE
1. Запрос `GET /api/cards` без параметров.
2. В `findAll(undefined)` — запрос без `WHERE is_done`.

**Результат:** ✅ Пройдено.

## Итог

Все 7 критериев приёмки пройдены. Изменение реализовано полностью.
