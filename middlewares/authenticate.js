import jwt from "jsonwebtoken";

import httpStatuses from "../helpers/http_statuses.js";
import Response from "../helpers/responses.js";
import UserServices from "../services/user.js";
import User from "../models/user.js";

export default async function authenticate(req, res, next) {
	const bearerToken =
		req.headers.authorization &&
		req.headers.authorization.replace("Bearer ", "");
	if (!bearerToken)
		return Response.error(
			res,
			"no bearer token provided.",
			httpStatuses.statusUnauthorized
		);
	const { userId, email, iat } = jwt.verify(
		bearerToken,
		process.env.JWT_SECRET
	);
	const user = await UserServices.findUser(userId, email);
	if (!user)
		return Response.error(
			res,
			"invalid or malformed bearer token.",
			httpStatuses.statusUnauthorized
		);
	if (await User.hasChangedPassword(userId, iat)) {
		return Response.error(
			res,
			"user recently changed their password, request for a new token.",
			httpStatuses.statusForbidden
		);
  }
	req.user = user;
	next();
}
