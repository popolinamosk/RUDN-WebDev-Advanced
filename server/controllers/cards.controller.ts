import type { Request, Response } from "express";
import * as cardsService from "../services/cards.service.ts";

export async function getCards(req: Request, res: Response) {
  const cards = await cardsService.getAll();
  res.json(cards);
}

export async function createCard(req: Request, res: Response) {
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
}

export async function deleteCard(req: Request, res: Response) {
  const isDeleted = await cardsService.remove(req.params.id);

  if (!isDeleted) {
    res.status(404).json({ error: "Карточка не найдена" });
    return;
  }

  res.status(204).end();
}