const calculateTip = (total, tipPercent = .25) => total + (total * tipPercent);

function fahrenheitToCelsius(temp) {
  return (temp - 32) / 1.8;
}

function celsiusToFahrenheit(temp) {
  return (temp * 1.8) + 32;
}

module.exports = {
	calculateTip,
	fahrenheitToCelsius,
	celsiusToFahrenheit,
};
