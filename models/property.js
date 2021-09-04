export default class Property {
	constructor(
		owner,
		status,
		type,
		price,
		state,
		city,
		address,
		property_image
	) {
		this.owner = owner;
		this.status = status;
		this.type = type;
		this.price = price;
		this.state = state;
		this.city = city;
		this.address = address;
		this.propertyImage = property_image;
	}
}
