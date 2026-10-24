import type { Card } from "../types/card.ts";

const cards: Card[] = [
  { id: "1", title: "Спроектировать структуру доски", isDone: true, isUrgent: false },
  { id: "2", title: "Подключить доску к серверу", isDone: false, isUrgent: true },
  { id: "3", title: "Добавить фильтр выполненных карточек", isDone: false, isUrgent: false },
];

export async function getAll(): Promise<Card[]> {
  return cards;
}

export async function create(title: string): Promise<Card> {
  const newCard: Card = {
    id: String(Date.now()),
    title,
    isDone: false,
    isUrgent: false,
  };
  cards.push(newCard);
  return newCard;
}

export async function remove(id: string): Promise<boolean> {
  const index = cards.findIndex((card) => card.id === id);

  if (index === -1) {
    return false;
  }

  cards.splice(index, 1);
  return true;
}