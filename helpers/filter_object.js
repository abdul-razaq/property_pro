export default function filterObject(object, ...unwantedFields) {
	const obj = { ...object };
	for (let key of Object.keys(obj)) {
		if (unwantedFields.includes(key)) {
			delete obj[key];
		}
	}
  return obj;
}
