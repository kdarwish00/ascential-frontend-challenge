import React, { useState, useEffect } from "react";
import {
	SimpleGrid,
	Flex,
	Spinner,
	Heading,
	Text,
	Box,
	Badge,
	LinkBox,
	LinkOverlay,
	IconButton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { Link as BrowserLink } from "react-router-dom";
import { useSeatGeek } from "../utils/useSeatGeek";
import Error from "./Error";
import Breadcrumbs from "./Breadcrumbs";
import {
	getFavourites,
	addFavourite,
	removeFavourite,
} from "../utils/favourites";

export interface VenueProps {
	id: number;
	has_upcoming_events: boolean;
	num_upcoming_events: number;
	name_v2: string;
	display_location: string;
	venues: string;
}

interface VenueItemProps {
	venue: VenueProps;
}

const Venues: React.FC = () => {
	const { data, error } = useSeatGeek("/venues", {
		sort: "score.desc",
		per_page: "24",
	});

	const [favouriteVenues, setfavouriteVenues] = useState<VenueProps[]>([]);
	const [favouritesMap, setfavouritesMap] = useState<Record<number, boolean>>(
		{}
	);

	useEffect(() => {
		if (data) {
			const favouriteIds = getFavourites();
			const favouritesMap = favouriteIds.reduce((acc, id) => {
				acc[parseInt(id)] = true;
				return acc;
			}, {} as Record<number, boolean>);
			setfavouritesMap(favouritesMap);
			const filteredfavourites = data.venues?.filter(
				(venue: VenueProps) =>
					favouriteIds.includes(venue.id.toString())
			);
			setfavouriteVenues(filteredfavourites || []);
		}
	}, [data]);

	const handleFavouriteToggle = (id: number) => {
		if (favouritesMap[id]) {
			removeFavourite(id.toString());
		} else {
			addFavourite(id.toString());
		}
		setfavouritesMap((prev) => {
			const updatedMap = { ...prev, [id]: !prev[id] };
			const updatedfavourites = Object.keys(updatedMap)
				.filter((key) => updatedMap[parseInt(key)])
				.map((key) => key.toString());
			setfavouriteVenues(
				data.venues?.filter(
					(venue: { id: { toString: () => string } }) =>
						updatedfavourites.includes(venue.id.toString())
				) || []
			);
			return updatedMap;
		});
	};

	if (error) return <Error />;

	if (!data) {
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);
	}

	return (
		<>
			<Breadcrumbs
				items={[{ label: "Home", to: "/" }, { label: "Venues" }]}
			/>

			{favouriteVenues.length > 0 && (
				<>
					<Heading size="lg" m="6">
						Your Favourite Venues
					</Heading>
					<SimpleGrid spacing="6" m="6" minChildWidth="350px">
						{favouriteVenues.map((venue: VenueProps) => (
							<VenueItem
								key={venue.id.toString()}
								venue={venue}
								isfavourite={!!favouritesMap[venue.id]}
								onFavouriteToggle={handleFavouriteToggle}
							/>
						))}
					</SimpleGrid>
				</>
			)}

			<Heading size="lg" m="6">
				All Venues
			</Heading>
			<SimpleGrid spacing="6" m="6" minChildWidth="350px">
				{data.venues?.map((venue: VenueProps) => (
					<VenueItem
						key={venue.id.toString()}
						venue={venue}
						isfavourite={!!favouritesMap[venue.id]}
						onFavouriteToggle={handleFavouriteToggle}
					/>
				))}
			</SimpleGrid>
		</>
	);
};

const VenueItem: React.FC<
	VenueItemProps & {
		isfavourite: boolean;
		onFavouriteToggle: (id: number) => void;
	}
> = ({ venue, isfavourite, onFavouriteToggle }) => (
	<LinkBox>
		<Box
			p={[4, 6]}
			bg="gray.50"
			borderColor="gray.200"
			borderWidth="1px"
			justifyContent="center"
			alignContent="center"
			rounded="lg"
			_hover={{ bg: "gray.100" }}
		>
			<Badge
				colorScheme={venue.has_upcoming_events ? "green" : "red"}
				mb="2"
			>
				{`${
					venue.has_upcoming_events ? venue.num_upcoming_events : "No"
				} Upcoming Events`}
			</Badge>
			<Heading size="sm" noOfLines={1}>
				<LinkOverlay as={BrowserLink} to={`/venues/${venue.id}`}>
					{venue.name_v2}
				</LinkOverlay>
			</Heading>
			<Text fontSize="sm" color="gray.500">
				{venue.display_location}
			</Text>
			<IconButton
				aria-label={
					isfavourite ? "Remove from favourites" : "Add to favourites"
				}
				icon={<StarIcon />}
				onClick={() => onFavouriteToggle(venue.id)}
				colorScheme={isfavourite ? "yellow" : "gray"}
				variant="outline"
				mt="2"
			/>
		</Box>
	</LinkBox>
);

export default Venues;
