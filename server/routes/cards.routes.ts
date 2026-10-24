import { Router } from "express";
import { getCards, createCard, deleteCard } from "../controllers/cards.controller.ts";
import { validateNewCard } from "../middleware/validateNewCard.ts";

const router = Router();

router.get("/", getCards);
router.post("/", validateNewCard, createCard);
router.delete("/:id", deleteCard);

export default router;