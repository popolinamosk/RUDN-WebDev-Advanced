# Tasks: cards-counter

## 1. Обновить BoardHeader — принять и отрендерить счётчик

- [ ] 1.1 Добавить проп `totalCards: number` в типизацию `BoardHeaderProps`.
- [ ] 1.2 Отрендерить `(<span className={styles.count}>{totalCards}</span>)` сразу после `<h1>` внутри `.title`, чтобы итоговый формат был `Канбан-доска (N)`.
- [ ] 1.3 Добавить в `BoardHeader.module.css` класс `.count` с `color: var(--text-muted)` и `font-size: 14px`.

## 2. Проксировать данные из App.tsx

- [ ] 2.1 В `App.tsx` передать `totalCards={cards?.length ?? 0}` в `<BoardHeader />`.
- [ ] 2.2 Убедиться, что `BoardHeader` получает проп и рендерится корректно при загрузке и после.

## 3. Проверка

- [ ] 3.1 Запустить `npm run build` — без ошибок.
- [ ] 3.2 Визуально проверить: счётчик отображается рядом с названием, обновляется при добавлении карточки, показывает `(0)` когда карточек нет.
