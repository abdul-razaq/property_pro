import Router from "express";

import { UserValidator } from "../../middlewares/validators.js";
import * as authControllers from "../../controllers/auth/index.js";

const router = Router();

router
	.route("/register")
	.post(UserValidator.validateSignUp, authControllers.RegisterUser);

router.route("/email_confirmation/:token").all(authControllers.verifyEmail);

export default router;
