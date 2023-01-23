import type { SavedGameType } from "../types";

export function binarySearchOnStore(inputArray: SavedGameType[], item: SavedGameType, locale = 'en') {
	const collator = Intl.Collator(locale)
	let low = 0;
	let high = inputArray?.length - 1;
	let mid;
	let comparison;
	
	while (low <= high) {
		mid = (low + high) >>> 1; /* equivalent to Math.floor((low + hight) / 2) but faster */
		const midValue = inputArray[mid];
		comparison = collator.compare(midValue?.name, item?.name);

		if (comparison < 0) {
			low = mid + 1;
		} else if (comparison > 0) {
			high = mid - 1;
		} else {
			return mid;
		}
	}

	return low;
}