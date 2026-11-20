# Design: server-side done filter

## Решение

### Параметр строки запроса

| Параметр | Значение | Поведение |
|---|---|---|
| `done` | отсутствует | Возвращаются все карточки, без условия `WHERE` |
| `done` | `false` | Возвращаются только невыполненные карточки (`WHERE is_done = false`) |
| `done` | `true` | Возвращаются только выполненные карточки (`WHERE is_done = true`) |
| `done` | любое другое | Ответ 400 |

Фильтр «скрыть выполненные» на клиенте отправляет `done=false`. Когда фильтр выключен — параметр отсутствует.

### Обоснование выбора имени и значений

**Имя `done`:** отражает суть поля карточки `is_done`. Короткое, понятное, без избыточных префиксов.

**Значения `true` / `false` (в виде строк в URL):** соответствуют булевому типу поля `is_done` в базе. Строковое представление в URL естественно для параметра строки запроса — браузер и fetch не требуют дополнительной сериализации.

**Отсутствие параметра = без фильтра:** пользователь ожидает, что выключенный фильтр показывает все карточки. Передача `done=true` или `done=false` при выключенном фильтре была бы избыточной и могла бы запутать кэширование (прокси и CDN по-разному обрабатывают запросы с параметрами). Отсутствие параметра — явный сигнал «фильтр не применён».

**400 для негодных значений:** вместо молчаливого игнорирования или интерпретации `done=1` как `true`, сервер отклоняет запрос с 400. Это заставляет клиента отправлять корректные значения и помогает при отладке.

### Слои

#### Репозиторий

Функция `findAll(isDone?: boolean)` в `server/repositories/cards.repository.ts`:

```ts
export async function findAll(isDone?: boolean): Promise<Card[]> {
  if (isDone !== undefined) {
    const result = await pool.query(
      "SELECT id, title, is_done, is_urgent FROM cards WHERE is_done = $1 ORDER BY created_at DESC",
      [isDone],
    );
    return result.rows.map(toCard);
  }

  const result = await pool.query(
    "SELECT id, title, is_done, is_urgent FROM cards ORDER BY created_at DESC",
  );

  return result.rows.map(toCard);
}
```

- Параметр `isDone` имеет тип `boolean | undefined`.
- При `undefined` — запрос без `WHERE`.
- При `true` / `false` — запрос с `WHERE is_done = $1`.
- Значение попадает в SQL только через `$1`.

#### Сервис

Функция `getAll(isDone?: boolean)` в `server/services/cards.service.ts`:

```ts
export async function getAll(isDone?: boolean): Promise<Card[]> {
  return cardsRepository.findAll(isDone);
}
```

Без дополнительной логики — просто пробрасывает параметр.

#### Контроллер

Функция `getCards(req, res)` в `server/controllers/cards.controller.ts`:

1. Считать `req.query.done` (строка или `undefined`).
2. Валидировать:
   - `undefined` → `isDone = undefined`
   - `"true"` → `isDone = true`
   - `"false"` → `isDone = false`
   - любое другое → ответить 400
3. Вызвать `cardsService.getAll(isDone)`.
4. Ответить 200 с массивом карточек.

```ts
export async function getCards(req: Request, res: Response) {
  const rawDone = req.query.done;

  let isDone: boolean | undefined;

  if (rawDone === undefined) {
    isDone = undefined;
  } else if (rawDone === "true") {
    isDone = true;
  } else if (rawDone === "false") {
    isDone = false;
  } else {
    res.status(400).json({ error: 'Параметр "done" должен быть "true" или "false"' });
    return;
  }

  const cards = await cardsService.getAll(isDone);
  res.json(cards);
}
```

#### Клиент

**API-функция** `fetchCards(hideDone?: boolean)` в `client/src/api/cards.ts`:

```ts
export async function fetchCards(hideDone?: boolean): Promise<Card[]> {
  const params = new URLSearchParams();
  if (hideDone === true) {
    params.set("done", "false");
  }
  const url = `/api/cards${params.toString() ? "?" + params.toString() : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Не удалось загрузить карточки");
  return response.json();
}
```

Параметр `hideDone` на клиенте имеет обратную семантику: `hideDone=true` означает «скрыть выполненные», поэтому в запросе отправляется `done=false`. При `hideDone=false` параметр `done` не добавляется.

**Стор useBoardFiltersStore:** состояние `hideDone` хранится в глобальном сторе, а не в `useState` компонента:

```ts
import { create } from "zustand";

type BoardFiltersState = {
  hideDone: boolean;
  toggleHideDone: () => void;
};

export const useBoardFiltersStore = create<BoardFiltersState>((set) => ({
  hideDone: false,
  toggleHideDone: () => set((state) => ({ hideDone: !state.hideDone })),
}));
```

**Компонент BoardHeader** — использует стор для отображения и переключения фильтра:

```tsx
const hideDone = useBoardFiltersStore((s) => s.hideDone);
const toggleHideDone = useBoardFiltersStore((s) => s.toggleHideDone);

// рендерит чекбокс, checked={hideDone}, onClick={toggleHideDone}
```

**Компонент App** — передаёт `hideDone` в `useQuery`:

```tsx
const hideDone = useBoardFiltersStore((s) => s.hideDone);

const { data: cards, isLoading } = useQuery({
  queryKey: ["cards", hideDone],
  queryFn: () => fetchCards(hideDone),
});
```

Ключ `useQuery` включает `hideDone`, поэтому при переключении фильтра React Query автоматически делает новый запрос к `/api/cards?done=false` или `/api/cards` без параметра.

### Альтернативы

| Альтернатива | Почему не подошла |
|---|---|
| Клиентская фильтрация (текущее поведение) | Сервер отдаёт все карточки, даже если пользователю нужны только невыполненные. Не масштабируется. |
| Отдельный эндпоинт `GET /cards/pending` | Нарушает REST-принципы: один ресурс, разные представления — это параметр, а не отдельный ресурс. |
| HTTP-заголовок вместо параметра | Заголовки менее удобны для кэширования на уровне CDN и сложнее отлаживаются в devtools. |
