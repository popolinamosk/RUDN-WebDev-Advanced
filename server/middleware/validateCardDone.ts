import type { Request, Response, NextFunction } from "express";

export function validateCardDone(req: Request, res: Response, next: NextFunction) {
  const { isDone } = req.body;

  if (typeof isDone !== "boolean") {
    res.status(400).json({ error: "isDone должен быть boolean" });
    return;
  }

  next();
}
