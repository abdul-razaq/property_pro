import Response from "../../helpers/responses.js";

export function getProfile(req, res, next) {
	Response.OK(res, "user profile fetched successfully.", { user: req.user });
}

export function updateProfile(req, res, next) {}

export function deleteUser(req, res, next) {
	// Deactivate user account by setting active to false.
}
