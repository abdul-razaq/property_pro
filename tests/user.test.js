import { jest } from "@jest/globals";
import dotenv from "dotenv";
import request from "supertest";

import app from "../app";
import httpStatuses from "../helpers/http_statuses.js";
import db from "../config/database/db.js";
import Migration from "../config/database/migrations.js";
import UserServices from "../services/user.js";
import User from "../models/user.js";

dotenv.config();

const user = new User({
	email: "aisha@gmail.com",
	first_name: "Aisha",
	last_name: "Suleiman",
	password: "residentevil123",
	phone_number: "09034442421",
	address: "123, Hacker way.",
	role: "agent",
});

let newUser;

beforeEach(async () => {
	await db.queryDB("DELETE FROM users;");
	await Migration.createTables();
	newUser = await UserServices.createUser(user);
	newUser.jwtToken = User.generateJWT(newUser.user_id, newUser.email);
});

afterEach(() => {
	console.log("after each!");
});

// test("it should register a new user", async () => {
// 	await request(app)
// 		.post("/api/v1/auth/register")
// 		.send({
// 			email: "aisha@gmail.com",
// 			password: "residentevil123",
// 			confirm_password: "residentevil123",
// 			first_name: "Aisha",
// 			last_name: "Suleiman",
// 			address: "125 Hacker way.",
// 			phone_number: "08043324242",
// 		})
// 		.expect(200);
// });

test("it should login a user", async () => {
	const response = await request(app)
		.post("/api/v1/auth/login")
		.send({
			email: "razaqayomide01@gmail.com",
			password: "propertyproadminpass123",
		})
		.expect(httpStatuses.statusOK);
	expect(response.body.message).toBe("login successful");
});

test("it should not login nonexistent user", async () => {
	await request(app)
		.post("/api/v1/auth/login")
		.send({
			email: "aisha2@gmail.com",
			password: "residentevil123",
		})
		.expect(httpStatuses.statusNotFound);
});

test("it should fail when bad password is provided", async () => {
	await request(app)
		.post("/api/v1/auth/login")
		.send({
			email: "aisha@gmail.com",
			password: "residentevil1234",
		})
		.expect(httpStatuses.statusUnauthorized);
});

test("it should not fetch an unauthenticated user's profile", async () => {
	await request(app)
		.get("/api/v1/users/profile")
		.send()
		.expect(httpStatuses.statusUnauthorized);
});

test("it should fetch an authenticated user's profile", async () => {
	await request(app)
		.get("/api/v1/users/profile")
		.set("authorization", newUser.jwtToken)
		.send()
		.expect(httpStatuses.statusOK);
});
