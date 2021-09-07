const {
	calculateTip,
	fahrenheitToCelsius,
	celsiusToFahrenheit,
	asyncAdd,
} = require("./math.js");
// jest provides globals in all test suite files. like test();
// setup a new test.
test("Hello World!", () => {
	// if this function throws an error, then the test case is considered a failure.
	// if this function does not throw an error, this test case is considered a success.
});

// test("This should fail", () => {
// 	throw new Error("test failed");
// });

test("Should calculate total with tip", () => {
	const total = calculateTip(10, 0.3);
	expect(total).toBe(13);
});

test("Should calculate total with default tip", () => {
	const total = calculateTip(10);
	expect(total).toBe(12.5);
});

test("Should convert 32 F to 0 C", () => {
	const fahToCel = fahrenheitToCelsius(32);
	expect(fahToCel).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
	const celToFah = celsiusToFahrenheit(0);
	expect(celToFah).toBe(32);
});

// Testing asynchronous code.
// test("Async test demo", done => {
// 	setTimeout(() => {
// 		expect(1).toBe(2);
// 		done();
// 	}, 2000);
// });

// other ways of testing asynchronous code with promises and async/await
test("should add two numbers promises", done => {
	asyncAdd(3, 2).then(sum => {
		expect(sum).toBe(5);
		done();
	});
});

// async/await way of testing code
test("should add two numbers async/await", async () => {
	// since async functions return promises by default, jest will wait for the returned promise to fulfill or reject to determine the test result.
	const sum = await asyncAdd(10, 22);
	expect(sum).toBe(32);
});
