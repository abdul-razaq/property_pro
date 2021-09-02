import Router from "express";

import { UserValidator } from "../../middlewares/validators.js";
import * as authControllers from "../../controllers/auth/index.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router
	.route("/register")
	.put(UserValidator.validateSignUp, authControllers.RegisterUser);

router.route("/email_confirmation/:token").all(authControllers.verifyEmail);
router.post("/login", UserValidator.validateSignIn, authControllers.loginUser);
router.patch(
	"/updatePassword",
	authenticate,
	UserValidator.validatePasswordUpdate,
	authControllers.updatePassword
);

export default router;
