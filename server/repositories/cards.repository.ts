import { pool } from "../db/pool.ts";
import type { Card } from "../types/card.ts";

type CardRow = {
  id: number;
  title: string;
  is_done: boolean;
  is_urgent: boolean;
};

function toCard(row: CardRow): Card {
  return {
    id: String(row.id),
    title: row.title,
    isDone: row.is_done,
    isUrgent: row.is_urgent,
  };
}

export async function findAll(): Promise<Card[]> {
  const result = await pool.query(
    "SELECT id, title, is_done, is_urgent FROM cards ORDER BY created_at DESC",
  );

  return result.rows.map(toCard);
}

export async function insert(title: string, ownerId: number): Promise<Card> {
  const result = await pool.query(
    `INSERT INTO cards (title, owner_id)
     VALUES ($1, $2)
     RETURNING id, title, is_done, is_urgent`,
    [title, ownerId],
  );

  return toCard(result.rows[0]);
}

export async function deleteById(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM cards WHERE id = $1", [id]);

  return result.rowCount === 1;
}

export async function setDone(id: number, isDone: boolean): Promise<Card | null> {
  const result = await pool.query(
    `UPDATE cards SET is_done = $1
     WHERE id = $2
     RETURNING id, title, is_done, is_urgent`,
    [isDone, id],
  );

  return result.rows.length === 1 ? toCard(result.rows[0]) : null;
}
