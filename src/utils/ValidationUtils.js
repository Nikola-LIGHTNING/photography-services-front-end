export function hasValidResponseStatus(response, validStatusesList) {
	const validStatusesSet = new Set(validStatusesList);
	if (!response.status || !validStatusesSet.has(response.status)) {
		return false;
	}

	return true;
}
