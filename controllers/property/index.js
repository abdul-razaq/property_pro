import fs from "fs";

import Response from "../../helpers/responses.js";
import httpStatuses from "../../helpers/http_statuses.js";
import cloudinary from "../../config/images/cloudinary.js";
import Property from "../../models/property.js";
import PropertyServices from "../../services/property.js";

export async function createProperty(req, res, next) {
	if (req.errorsExists)
		return Response.error(
			res,
			"validation failed. check input values provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	try {
		const propertyImage = (
			await cloudinary.uploader.upload(
				`uploads/properties/${req.body.propertyImage}`,
				{
					folder: "images/properties",
				}
			)
		).secure_url;
		await fs.promises.rm(
			`uploads/properties/${propertyImage.original_filename}.${propertyImage.original_extension}`,
			{
				force: true,
				maxRetries: 2,
				recursive: true,
				retryDelay: 5000,
			}
		);
	} catch (error) {
		return next(error);
	}
	const { type, state, price, city, address, status } = req.body;
	const property = new Property(
		req.user.user_id,
		status,
		type,
		price,
		state,
		city,
		address,
		propertyImage
	);
  let newProperty;
	try {
		newProperty = await PropertyServices.createProperty(property);
	} catch (error) {
		return Response.error(
			res,
			"error creating property.",
			httpStatuses.statusInternalServerError
		);
	}
	Response.OK(res, "property created successfully.", newProperty);
}
