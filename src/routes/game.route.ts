import { Router } from "express";
import { ROUTES } from "../config/routes.config";
import { insertGameController } from "../controllers/game-controllers/insertGame.controller";
import { insertProposedGoalsController } from "../controllers/game-controllers/insertGoals.controller";
import { insertUserController } from "../controllers/game-controllers/insertUser.controller";
import { upvoteGoalController } from "../controllers/game-controllers/upvoteGoal.controller";
const router = Router();

router.route(ROUTES.games.insertGame).post(insertGameController);
// router.route(ROUTES.games.insertGoals).patch(insertGoalsController);
router.route(ROUTES.games.insertProposedGoals).patch(insertProposedGoalsController);
router.route(ROUTES.games.insertUser).patch(insertUserController);
router.route(ROUTES.games.upvoteGoal).patch(upvoteGoalController);

export default router;
