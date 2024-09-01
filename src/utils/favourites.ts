/**
 * Retrieves the list of favourite item IDs from local storage.
 *
 * @returns {string[]} An array of strings representing the IDs of favourite items.
 * If there are no storageItems, returns an empty array.
 */
export const getLocalStorageList = (storage: string): string[] => {
	const storageItems = localStorage.getItem(storage);
	return storageItems ? JSON.parse(storageItems) : [];
};

/**
 * Adds an item ID to the list of favourites in local storage.
 *
 * @param {string} id - The ID of the item to add to favourites. This should be a unique identifier for the item.
 *
 * @returns {void} This function does not return a value. It modifies the favourites list in local storage.
 */
export const addFavourite = (id: string, storage: string): void => {
	const favourites = getLocalStorageList(storage);
	if (!favourites.includes(id)) {
		favourites.push(id);
		localStorage.setItem(storage, JSON.stringify(favourites));
	}
};

/**
 * Removes an item ID from the list of favourites in local storage.
 *
 * @param {string} id - The ID of the item to remove from favourites. This should be a unique identifier for the item.
 *
 * @returns {void} This function does not return a value. It modifies the favourites list in local storage.
 */
export const removeFavourite = (id: string, storage: string): void => {
	let favourites = getLocalStorageList(storage);
	favourites = favourites.filter((favourite) => favourite !== id);
	localStorage.setItem(storage, JSON.stringify(favourites));
};

/**
 * Checks if an item ID is in the list of favourites in local storage.
 *
 * @param {string} id - The ID of the item to check. This should be a unique identifier for the item.
 *
 * @returns {boolean} Returns `true` if the item ID is in the favourites list, otherwise `false`.
 */
export const isFavourite = (id: string, storage: string): boolean => {
	const favourites = getLocalStorageList(storage);
	return favourites.includes(id);
};
