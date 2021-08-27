import Response from "../helpers/responses.js";

export default (err, req, res, next) => Response.sendErrorResponse(res, err);
