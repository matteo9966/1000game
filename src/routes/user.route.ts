import {Router} from 'express';
import {ROUTES} from '../config/routes.config';
import {signupAdminController} from '../controllers/user-controllers/signupAdmin.controller';
import {loginController} from '../controllers/user-controllers/login.controller';
import {insertReachedGoalController} from '../controllers/user-controllers/insertGoal.controller';
import {changePasswordController} from '../controllers/user-controllers/changePassword.controller';
import { refreshGameController } from '../controllers/user-controllers/refresh.controller';
const router = Router();

router.route(ROUTES.users.signupUser).post(signupAdminController);
router.route(ROUTES.users.login).post(loginController);
router.route(ROUTES.users.reachedGoal).patch(insertReachedGoalController);
router.route(ROUTES.users.changePassword).patch(changePasswordController);
router.route(ROUTES.users.refresh).get(refreshGameController);

export default router;
