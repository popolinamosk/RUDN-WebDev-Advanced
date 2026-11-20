import type { Request, Response } from "express";
import * as cardsService from "../services/cards.service.ts";

function parseId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

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

export async function createCard(req: Request, res: Response) {
  const card = await cardsService.create(req.body.title.trim());
  res.status(201).json(card);
}

export async function deleteCard(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: "id карточки должен быть целым положительным числом" });
    return;
  }

  const isDeleted = await cardsService.remove(id);

  if (!isDeleted) {
    res.status(404).json({ error: "Карточка не найдена" });
    return;
  }

  res.status(204).end();
}

export async function patchCardDone(req: Request, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ error: "id карточки должен быть целым положительным числом" });
    return;
  }

  const card = await cardsService.updateCardDone(id, req.body.isDone);

  if (!card) {
    res.status(404).json({ error: "Карточка не найдена" });
    return;
  }

  res.json(card);
}
