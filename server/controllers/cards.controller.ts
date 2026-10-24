import type { Request, Response } from "express";
import * as cardsService from "../services/cards.service.ts";

export async function getCards(req: Request, res: Response) {
  const cards = await cardsService.getAll();
  res.json(cards);
}

export async function createCard(req: Request, res: Response) {
  const card = await cardsService.create(req.body.title.trim());
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

export async function patchCardDone(req: Request, res: Response) {
  const card = await cardsService.updateCardDone(req.params.id, req.body.isDone);

  if (!card) {
    res.status(404).json({ error: "Карточка не найдена" });
    return;
  }

  res.json(card);
}