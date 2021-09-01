import express from "express";

import * as userControllers from "../../controllers/user/index.js";
// import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

// router.use(authenticate);

router
	.route("/profile")
	.get(userControllers.getProfile)
	.patch(userControllers.updateProfile)
	.delete(userControllers.deleteUser);

export default router;
