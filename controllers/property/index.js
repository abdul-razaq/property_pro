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
	let propertyImage;
	try {
		propertyImage = (
			await cloudinary.uploader.upload(
				`uploads/properties/${req.body.propertyImage}`,
				{
					folder: "images/properties",
				}
			)
		).secure_url;
		await fs.promises.rm(
			`uploads/properties/$${req.body.propertyImage}.${propertyImage.original_extension}`,
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

export async function deleteProperty(req, res, next) {
	if (!req.params.id)
		return Response.error(
			res,
			"no property id supplied.",
			httpStatuses.statusBadRequest
		);
	if (!(await PropertyServices.deleteProperty(req.params.id, req.user.user_id)))
		return Response.error(
			res,
			"error deleting property.",
			httpStatuses.statusInternalServerError
		);
	Response.OK(
		res,
		httpStatuses.statusNoContent,
		"property deleted successfully"
	);
}

export async function markPropertyAsSold(req, res, next) {
	if (!req.params.id)
		return Response.error(
			res,
			"property id is required.",
			httpStatuses.statusBadRequest
		);
	if (
		!(await PropertyServices.markPropertyAsSold(
			req.params.id,
			req.user.user_id
		))
	)
		return Response.error(
			res,
			"unable to mark property as sold.",
			httpStatuses.statusForbidden
		);
	Response.OK(res, "property marked as sold successfully.");
}

export async function getProperty(req, res, next) {
	const property = await PropertyServices.getProperty(req.params.id);
	if (!property) {
		return Response.error(
			res,
			"property not found.",
			httpStatuses.statusNotFound
		);
	}
	Response.OK(res, "property fetched successfully.", property);
}

export async function getProperties(req, res, next) {
	const { type } = req.query;
	const properties = await PropertyServices.getProperties(type);
	Response.OK(res, "properties fetched successfully", {
		properties,
		total: properties.length,
	});
}

export async function flagProperty(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation failed. check input values provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	const { reason, description } = req.body;
	if (
		!(await PropertyServices.flagProperty(req.params.id, reason, description))
	)
		return Response.error(res, "unable to flag property");
	Response.OK(res, "property flagged successfully");
}
