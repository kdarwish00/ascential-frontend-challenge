import { useState } from "react";
import { addFavourite, getLocalStorageList, isFavourite, removeFavourite } from "../utils/favourites";

const useFavouriteHook = ( storageListName: string) => {

const [favourite, setFavourite] = useState<string[]>(getLocalStorageList(storageListName));

const handleFavouriteToggle = (favouriteId: string,) => {
	if (isFavourite(favouriteId.toString(), storageListName)) {
		removeFavourite(favouriteId.toString(), storageListName);
	} else {
		addFavourite(favouriteId.toString(), storageListName);
	}
	setFavourite(getLocalStorageList(storageListName));
};

return {handleFavouriteToggle, favourite}
}

export default useFavouriteHook