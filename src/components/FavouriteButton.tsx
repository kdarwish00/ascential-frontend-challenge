import React from "react";
import { IconButton } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface FavouriteButtonProps {
	isFavourite: boolean;
	onToggle: () => void;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
	isFavourite,
	onToggle,
}) => {
	return (
		<IconButton
			aria-label={
				isFavourite ? "Remove from favourites" : "Add to favourites"
			}
			icon={<StarIcon />}
			onClick={onToggle}
			colorScheme={isFavourite ? "yellow" : "gray"}
			variant="outline"
		/>
	);
};

export default FavouriteButton;
