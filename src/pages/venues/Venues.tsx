import React, { useState, useEffect } from "react";
import {
	SimpleGrid,
	Flex,
	Spinner,
	Heading,
	Text,
	LinkBox,
	LinkOverlay,
	Badge,
	Select,
} from "@chakra-ui/react";
import { Link as BrowserLink } from "react-router-dom";
import { useSeatGeek } from "../../utils/useSeatGeek";
import Error from "../../components/Error";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavouriteButton from "../../components/FavouriteButton";
import { filterVenuesByLocation } from "../../utils/filterEvents";
import useFavouriteHook from "../../hooks/useFavouriteHook";

export interface VenueProps {
	id: number;
	has_upcoming_events: boolean;
	num_upcoming_events: number;
	name_v2: string;
	display_location: string;
}

interface VenueItemProps {
	venue: VenueProps;
	isFavourite: boolean;
	onFavouriteToggle: (id: string) => void;
}

const Venues: React.FC = () => {
	const { data, error } = useSeatGeek("/venues", {
		sort: "score.desc",
		per_page: "24",
	});

	const [selectedLocation, setSelectedLocation] = useState<string | null>(
		null
	);
	const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
	const { handleFavouriteToggle, favourite: favouriteVenueIds } =
		useFavouriteHook("VenueFav");

	useEffect(() => {
		if (data && data.venues) {
			const locations = [
				...new Set(
					data.venues.map(
						(venue: VenueProps) => venue.display_location
					)
				),
			] as string[];
			setUniqueLocations(locations);
		}
	}, [data]);

	const filteredAllVenues = filterVenuesByLocation(
		data?.venues || [],
		selectedLocation || ""
	);

	if (error) return <Error />;

	if (!data || !data.venues) {
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);
	}

	const favouriteVenues = filteredAllVenues.filter((venue: VenueProps) =>
		favouriteVenueIds.includes(venue.id.toString())
	);

	return (
		<>
			<Breadcrumbs
				items={[{ label: "Home", to: "/" }, { label: "Venues" }]}
			/>

			<Flex direction="column" m="6">
				<Heading size="md" mb="4">
					Filter by Location
				</Heading>
				<Select
					placeholder="Select location"
					value={selectedLocation || ""}
					onChange={(e) => setSelectedLocation(e.target.value)}
					mb="4"
				>
					<option value="">All Locations</option>
					{uniqueLocations.map((location) => (
						<option key={location} value={location}>
							{location}
						</option>
					))}
				</Select>
			</Flex>

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
								isFavourite={true}
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
				{filteredAllVenues.map((venue: VenueProps) => (
					<VenueItem
						key={venue.id.toString()}
						venue={venue}
						isFavourite={favouriteVenueIds.includes(
							venue.id.toString()
						)}
						onFavouriteToggle={handleFavouriteToggle}
					/>
				))}
			</SimpleGrid>
		</>
	);
};

const VenueItem: React.FC<VenueItemProps> = ({
	venue,
	isFavourite,
	onFavouriteToggle,
}) => (
	<LinkBox
		as="article"
		p={[4, 6]}
		bg="gray.50"
		borderColor="gray.200"
		borderWidth="1px"
		rounded="lg"
		_hover={{ bg: "gray.100" }}
	>
		<Badge colorScheme={venue.has_upcoming_events ? "green" : "red"} mb="2">
			{venue.has_upcoming_events
				? `${venue.num_upcoming_events} Upcoming Events`
				: "No Upcoming Events"}
		</Badge>
		<Heading size="sm" noOfLines={1}>
			<LinkOverlay as={BrowserLink} to={`/venues/${venue.id}`}>
				{venue.name_v2}
			</LinkOverlay>
		</Heading>
		<Text fontSize="sm" color="gray.500" mb="2">
			{venue.display_location}
		</Text>
		<FavouriteButton
			isFavourite={isFavourite}
			onToggle={() => onFavouriteToggle(venue.id.toString())}
		/>
	</LinkBox>
);

export default Venues;
