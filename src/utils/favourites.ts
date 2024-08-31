/**
 * Retrieves the list of favourite item IDs from local storage.
 *
 * @returns {string[]} An array of strings representing the IDs of favourite items.
 * If there are no favourites stored, returns an empty array.
 */
export const getFavourites = (): string[] => {
	const favourites = localStorage.getItem("favourites");
	return favourites ? JSON.parse(favourites) : [];
};

/**
 * Adds an item ID to the list of favourites in local storage.
 *
 * @param {string} id - The ID of the item to add to favourites. This should be a unique identifier for the item.
 *
 * @returns {void} This function does not return a value. It modifies the favourites list in local storage.
 */
export const addFavourite = (id: string): void => {
	const favourites = getFavourites();
	if (!favourites.includes(id)) {
		favourites.push(id);
		localStorage.setItem("favourites", JSON.stringify(favourites));
	}
};

/**
 * Removes an item ID from the list of favourites in local storage.
 *
 * @param {string} id - The ID of the item to remove from favourites. This should be a unique identifier for the item.
 *
 * @returns {void} This function does not return a value. It modifies the favourites list in local storage.
 */
export const removeFavourite = (id: string): void => {
	let favourites = getFavourites();
	favourites = favourites.filter((favourite) => favourite !== id);
	localStorage.setItem("favourites", JSON.stringify(favourites));
};

/**
 * Checks if an item ID is in the list of favourites in local storage.
 *
 * @param {string} id - The ID of the item to check. This should be a unique identifier for the item.
 *
 * @returns {boolean} Returns `true` if the item ID is in the favourites list, otherwise `false`.
 */
export const isFavourite = (id: string): boolean => {
	const favourites = getFavourites();
	return favourites.includes(id);
};
