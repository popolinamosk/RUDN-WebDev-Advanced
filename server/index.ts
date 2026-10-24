import express from "express";
import * as cardsService from "./services/cards.service.ts";

const app = express();

app.use(express.json());

app.get("/cards", async (req, res) => {
  const cards = await cardsService.getAll();
  res.json(cards);
});

app.post("/cards", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: "title обязателен" });
    return;
  }

  if (typeof title !== "string") {
    res.status(400).json({ error: "title должен быть строкой" });
    return;
  }

  if (title.trim() === "") {
    res.status(400).json({ error: "title не может быть пустым" });
    return;
  }

  const card = await cardsService.create(title.trim());
  res.status(201).json(card);
});

app.delete("/cards/:id", async (req, res) => {
  const isDeleted = await cardsService.remove(req.params.id);

  if (!isDeleted) {
    res.status(404).json({ error: "Карточка не найдена" });
    return;
  }

  res.status(204).end();
});

app.use((req, res) => {
res.status(404).json({ error: "Такого пути нет: " + req.method + " " + req.url });});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Что-то сломалось на сервере" });
});

app.listen(3001, () => {
  console.log("Сервер запущен: http://localhost:3001");
});