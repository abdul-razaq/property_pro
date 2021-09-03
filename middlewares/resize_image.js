import sharp from "sharp";

export default async function (req, res, next) {
	if (!req.file) return next();
	req.body.propertyImage = `property-${req.user.user_id}-${Date.now()}.jpeg`;
	await sharp(req.file.buffer)
		.resize(800, 1000)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`uploads/properties/${req.body.propertyImage}`);
	next();
}
