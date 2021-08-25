import argon2 from "argon2";

import dbConnection from "./db.js";
import { usersTable, propertyTable, flagsTable } from "./tables.js";

/**
 * Create an Admin User.
 */
async function createAdminUser(usersTable) {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
	const adminAddress = process.env.ADMIN_ADDRESS;

	try {
		const hashedPassword = await argon2.hash(adminPassword, { saltLength: 10 });

		const query = `INSERT INTO ${usersTable} (email, first_name, last_name, password, phone_number, address, role, verified)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING;`;

		const queryParams = [
			adminEmail,
			"AbdulRazaq",
			"Suleiman",
			hashedPassword,
			adminPhoneNumber,
			adminAddress,
			"admin",
			true,
		];

		await dbConnection.queryDB(query, queryParams);
	} catch (error) {
		throw error;
	}
}

export default {
	/**
	 * @function
	 * Create users, property, flags tables.
	 * Insert Admin user to users table.
	 */
	createTables: async () => {
		try {
			await dbConnection.queryDB(usersTable);
			await dbConnection.queryDB(propertyTable);
			await dbConnection.queryDB(flagsTable);
			await createAdminUser("users");
		} catch (error) {
			throw error;
		}
	},
};
