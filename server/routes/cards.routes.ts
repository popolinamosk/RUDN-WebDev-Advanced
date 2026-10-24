import { Router } from "express";
import { getCards, createCard, deleteCard } from "../controllers/cards.controller.ts";

const router = Router();

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:id", deleteCard);

export default router;