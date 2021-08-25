import Response from "../helpers/responses";

export default (err, req, res, next) => Response.sendErrorResponse(res, err);
