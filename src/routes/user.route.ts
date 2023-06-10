import { Router } from "express";
import { ROUTES } from "../config/routes.config";
import { insertGameController } from "../controllers/game-controllers/insertGame.controller";
import { insertGoalsController,insertProposedGoalsController } from "../controllers/game-controllers/insertGoals.controller";
import { signupAdminController } from "../controllers/user-controllers/signupAdmin.controller";
const router = Router();

router.route(ROUTES.users.signupUser).post(signupAdminController);
// router.route(ROUTES.games.insertGoals).patch(insertGoalsController);
// router.route(ROUTES.games.insertProposedGoals).patch(insertProposedGoalsController);

export default router;
