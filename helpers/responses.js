import dotenv from "dotenv";
import { AppError } from "./app_error.js";

import httpStatuses from "./http_statuses.js";

dotenv.config();

/**
 * @class
 *
 * Defines methods that send http responses.
 */
export default class Response {
	/**
	 * @private @method
	 * @param {*} res HTTP Response object
	 * @param {*} message HTTP Response object
	 * @param {*} data data value to send along in the HTTP response
	 *
	 * Method is private and not to be used outside of this class.
	 */
	static _sendResponse(res, code, message, data, error) {
		let errorStatus;
		if (String(code).startsWith("2")) {
			errorStatus = "success";
		} else if (String(code).startsWith("4")) {
			errorStatus = "fail";
		} else {
			errorStatus = "error";
		}
		return res.status(code).json({
			status: errorStatus,
			code: code,
			message: message ?? "request completed successfully.",
			data: data ?? undefined,
			error: error ?? undefined,
			stack: error ? error.stack : undefined,
		});
	}

	/**
	 * @public
	 * @method
	 * @param {*} res HTTP Response object
	 * @param {*} error AppError error object
	 *
	 * Send success response message.
	 */

	static sendErrorResponse(res, error, data) {
		if (process.env.APP_MODE === "DEVELOPMENT") {
			!error.statusCode &&
				((error.statusCode = httpStatuses.statusInternalServerError),
				(error.status = "error"));
			return this._sendResponse(
				res,
				error.statusCode,
				error.message,
				data,
				error
			);
		} else {
			if (error.isOperational) {
				return this._sendResponse(res, error.statusCode, error.message, data);
			}
			console.error(`INTERNAL/NON-OPERATIONAL ERROR: ${error}`);
			console.error(error.stack);
			return this._sendResponse(
				res,
				httpStatuses.statusInternalServerError,
				"something terrible happened."
			);
		}
	}

	/**
	 * @public
	 * @method
	 * @param {*} res HTTP Response object
	 * @param {*} message HTTP Response object
	 * @param {*} data data value to send along in the HTTP response
	 *
	 * Send success response.
	 */
	static OK(res, message, data) {
		return this._sendResponse(res, httpStatuses.statusOK, message, data);
	}

	/**
	 * @public
	 * @method
	 * @param {*} res HTTP Response object
	 * @param {*} message HTTP Response object
	 * @param {*} data data value to send along in the HTTP response
	 *
	 * Send route not implemented response.
	 */
	static routeNotImplemented(res, message) {
		return this._sendResponse(res, httpStatuses.statusNotImplemented, message);
	}

	/**
	 * @public
	 * @method
	 * @param {*} res HTTP Response object
	 * @param {*} data data value to send along in the HTTP response
	 *
	 * Send error response.
	 */
	static error(res, message, statusCode, data) {
		const errObj =
			statusCode === httpStatuses.statusInternalServerError
				? new Error(
						message,
						statusCode ?? httpStatuses.statusInternalServerError
				  )
				: new AppError(message, statusCode);
		return this.sendErrorResponse(res, errObj, data);
	}
}
