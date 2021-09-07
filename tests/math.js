const calculateTip = (total, tipPercent = 0.25) => total + total * tipPercent;

function fahrenheitToCelsius(temp) {
	return (temp - 32) / 1.8;
}

function celsiusToFahrenheit(temp) {
	return temp * 1.8 + 32;
}

function asyncAdd(a, b) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (a < 0 || b < 0) return reject("Numbers must be non-negative.");
			resolve(a + b);
		}, 2000);
	});
}

module.exports = {
	calculateTip,
	fahrenheitToCelsius,
	celsiusToFahrenheit,
	asyncAdd,
};
