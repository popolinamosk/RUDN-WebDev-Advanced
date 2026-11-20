import { Router } from "express";
import { getCards, createCard, deleteCard, patchCardDone } from "../controllers/cards.controller.ts";
import { validateNewCard } from "../middleware/validateNewCard.ts";
import { validateCardDone } from "../middleware/validateCardDone.ts";

const router = Router();

router.get("/", getCards);
router.post("/", validateNewCard, createCard);
router.delete("/:id", deleteCard);
router.patch("/:id", validateCardDone, patchCardDone);

export default router;