import upload from "../config/images/multer.js";

export default fieldName => upload.single(fieldName);
