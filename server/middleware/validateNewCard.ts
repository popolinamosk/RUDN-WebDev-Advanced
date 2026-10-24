import type { Request, Response, NextFunction } from "express";

export function validateNewCard(req: Request, res: Response, next: NextFunction) {
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

  next();
}