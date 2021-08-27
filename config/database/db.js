import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const connectionString =
	process.env.APP_MODE === "DEVELOPMENT"
		? process.env.DEV_DB_CONN_STRING
		: process.env.PROD_DB_CONN_STRING;

const pool = new pg.Pool({
	connectionString,
});

pool.on("error", (err, _) => {
	console.error("Unexpected error on idle client!", err);
	process.exit(-1);
});

const dbConnection = {
	/**
	 * Connect to the database.
	 * @constructor
	 * @param {*} queryString - The passed in SQL query to execute.
	 * @param {*} queryParams - The passed in query parameter values to pass to the query.
	 */
	queryDB: async (queryString, queryParams) => {
		try {
			const client = await pool.connect();
			try {
				return await client.query(queryString, queryParams);
			} finally {
				client.release();
			}
		} catch (e) {
			setImmediate(() => {
				throw e;
			});
		}
	},
};

export default dbConnection;
