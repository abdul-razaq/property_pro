import express from "express";

import * as propertyControllers from "../../controllers/property/index.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import uploadImage from "../../middlewares/upload_image.js";
import resizeImage from "../../middlewares/resize_image.js";
import { PropertyValidator } from "../../middlewares/validators.js";

const router = express.Router();

router
	.route("/")
	.put(
		authenticate,
		authorize("agent"),
		uploadImage("image"),
		resizeImage,
		PropertyValidator.validateCreateProperty,
		propertyControllers.createProperty
	);

export default router;
