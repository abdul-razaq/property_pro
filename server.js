import http from "http";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;
const server = http.createServer(app);

server.listen(PORT, "localhost", () => {
	console.info(`Server listening for incoming requests on port ${PORT}`);
});

function handleUnhandledError(errorType, err) {
	if (process.env.APP_MODE === "DEVELOPMENT") {
		console.info(
			errorType === "uncaughtException"
				? "UNCAUGHT EXCEPTION!"
				: "UNHANDLED PROMISE REJECTION!"
		);
		console.error(`ERROR TYPE: ${err.name}\nERROR MESSAGE: ${err.message}`);
		console.error(err.stack);
		console.error(err);
	}
	server.close(() => {
		console.info("server shut down gracefully.");
		process.exit(1);
	});
}

process.setUncaughtExceptionCaptureCallback(err => {
	handleUnhandledError("uncaughtException", err);
});

process.on("uncaughtException", err => {
	handleUnhandledError("uncaughtException", err);
});

process.on("unhandledRejection", err => {
	handleUnhandledError("unhandledRejection", err);
});

process.on("SIGTERM", () => {
	console.info("SIGTERM RECEIVED. Shutting down gracefully...");
	server.close(() => console.info("server terminated!"));
});

process.on("SIGINT", () => {});
