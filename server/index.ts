import express from "express";
import cardsRouter from "./routes/cards.routes.ts";

const app = express();

app.use(express.json());

app.use("/cards", cardsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Такого пути нет: " + req.method + " " + req.url });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Что-то сломалось на сервере" });
});

app.listen(3001, () => {
  console.log("Сервер запущен: http://localhost:3001");
});