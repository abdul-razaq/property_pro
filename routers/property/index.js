import express from "express";

import * as propertyControllers from "../../controllers/property/index.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import uploadImage from "../../middlewares/upload_image.js";
import resizeImage from "../../middlewares/resize_image.js";
import { PropertyValidator } from "../../middlewares/validators.js";

const router = express.Router();

router.use(authenticate);

router
	.route("/")
	.get(propertyControllers.getAllProperties)
	.put(
		authorize("agent"),
		uploadImage("image"),
		resizeImage,
		PropertyValidator.validateCreateProperty,
		propertyControllers.createProperty
	);

router
	.route("/:id")
	.get(propertyControllers.getProperty)
	.delete(authorize("agent", "admin"), propertyControllers.deleteProperty);

router.patch(
	"/:id/sold",
	authorize("agent"),
	propertyControllers.markPropertyAsSold
);

export default router;
