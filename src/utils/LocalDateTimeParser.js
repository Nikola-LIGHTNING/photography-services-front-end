import { ParsingError } from "../errors/ParsingError";

const dateOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
};

const timeOptions = {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
};

export function getDateObjectFromDateTimeString(localDateTimeString) {
	let dateObject = null;
	try {
		dateObject = new Date(localDateTimeString);
	} catch (err) {
		// Log error using a logging service
		throw new ParsingError("Could not parse datetime string to Date object!");
	}

	return dateObject;
}

export function getLocalDateFromDateTimeString(localDateTimeString) {
	let dateObject = null;
	let localDateObject = null;
	try {
		dateObject = new Date(localDateTimeString);
		localDateObject = dateObject.toLocaleDateString("bg-BG", dateOptions);
	} catch (err) {
		// Log error using a logging service
		throw new ParsingError("Could not parse date string!");
	}

	return localDateObject;
}

export function getLocalTimeFromDateTimeString(localDateTimeString) {
	let dateObject = null;
	let localTimeObject = null;
	try {
		dateObject = new Date(localDateTimeString);
		localTimeObject = dateObject.toLocaleTimeString("bg-BG", timeOptions);
	} catch (err) {
		// Log error using a logging service
		throw new ParsingError("Could not parse time string!");
	}

	return localTimeObject;
}
