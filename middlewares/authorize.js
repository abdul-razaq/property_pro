import httpStatuses from "../helpers/http_statuses.js";
import Response from "../helpers/responses.js";

export default function authorize(...roles) {
	return function (req, res, next) {
		if (!roles.includes(req.user.role))
			return Response.error(
				res,
				"you are unauthorized to perform this operation.",
				httpStatuses.statusUnauthorized
			);
		next();
	};
}
