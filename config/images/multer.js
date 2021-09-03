import multer from "multer";

import { AppError } from "../../helpers/app_error.js";
import httpStatuses from "../../helpers/http_statuses.js";

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, callback) {
	const acceptedExt = ["jpg", "jpeg", "png", "gif", "svg", "tiff"];
	if (!acceptedExt.includes(file.mimetype.split("/")[1])) {
		callback(
			new AppError(
				"invalid image type provided.",
				httpStatuses.statusBadRequest
			),
			false
		);
	} else {
		callback(null, true);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: {
		fileSize: 10485760,
	},
});

export default upload;
