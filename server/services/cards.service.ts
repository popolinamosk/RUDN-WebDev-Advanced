import type { Card } from "../types/card.ts";
import * as cardsRepository from "../repositories/cards.repository.ts";

// Временно, до темы 6: пока входа нет, все карточки создаёт один и тот же пользователь.
// Это id пользователя из seed.sql — после npm run db:reset он всегда равен 1.
const CURRENT_USER_ID = 1;

export async function getAll(isDone?: boolean): Promise<Card[]> {
  return cardsRepository.findAll(isDone);
}

export async function create(title: string): Promise<Card> {
  return cardsRepository.insert(title, CURRENT_USER_ID);
}

export async function remove(id: number): Promise<boolean> {
  return cardsRepository.deleteById(id);
}

export async function updateCardDone(id: number, isDone: boolean): Promise<Card | null> {
  return cardsRepository.setDone(id, isDone);
}
