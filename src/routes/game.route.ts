import { Router } from "express";
import { ROUTES } from "../config/routes.config";
import { insertGameController } from "../controllers/game-controllers/insertGame.controller";
import { insertGoalsController } from "../controllers/game-controllers/insertGoals.controller";
const router = Router();

router.route(ROUTES.games.insertGame).post(insertGameController);
router.route(ROUTES.games.insertGoals).patch(insertGoalsController);

export default router;
