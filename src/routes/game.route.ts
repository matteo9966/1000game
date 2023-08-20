import { Router } from "express";
import { ROUTES } from "../config/routes.config";
import { insertGameController } from "../controllers/game-controllers/insertGame.controller";
import { insertProposedGoalsController } from "../controllers/game-controllers/insertGoals.controller";
import { insertUserController } from "../controllers/game-controllers/insertUser.controller";
import { upvoteGoalController } from "../controllers/game-controllers/upvoteGoal.controller";
import { addAccessTokenMiddleware } from "../middleware/addAccessToken.middleware";
import { authorizationMiddleware } from "../middleware/authorization.middelware";

/**
 * @constant {Router} router - Express router instance. used for the game routes
 * @description routes that need authorization are:
 * - insertGameController
 * 
 */
const router = Router();

router.route(ROUTES.games.insertGame).post(authorizationMiddleware(['admin']),insertGameController,addAccessTokenMiddleware);
// router.route(ROUTES.games.insertGoals).patch(insertGoalsController);
router.route(ROUTES.games.insertProposedGoals).patch(insertProposedGoalsController);
router.route(ROUTES.games.insertUser).patch(insertUserController);
router.route(ROUTES.games.upvoteGoal).patch(upvoteGoalController);

export default router;
