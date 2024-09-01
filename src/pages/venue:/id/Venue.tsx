import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
	Flex,
	Heading,
	Stat,
	StatLabel,
	StatNumber,
	SimpleGrid,
	Box,
	Spinner,
	AspectRatio,
} from "@chakra-ui/react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Error from "../../../components/Error";
import { useSeatGeek } from "../../../utils/useSeatGeek";
import {
	addFavourite,
	removeFavourite,
	isFavourite,
} from "../../../utils/favourites";
import FavouriteButton from "../../../components/FavouriteButton";
import Details from "../../../components/Deatils";

interface VenueProps {
	id: string;
	name: string;
	city: string;
	country: string;
	capacity: number;
	location: {
		lat: number;
		lon: number;
	};
}

const Venue: React.FC = () => {
	const { venueId } = useParams<{ venueId: string }>();
	const { data: venue, error } = useSeatGeek(`venues/${venueId}`);
	const [favourite, setFavourite] = useState(
		venueId ? isFavourite(venueId, "VenueFav") : false
	);

	const handleFavouriteToggle = () => {
		if (venueId) {
			if (favourite) {
				removeFavourite(venueId, "VenueFav");
			} else {
				addFavourite(venueId, "VenueFav");
			}
			setFavourite(!favourite);
		}
	};

	if (error) return <Error />;

	if (!venue) {
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);
	}

	return (
		<>
			<Breadcrumbs
				items={[
					{ label: "Home", to: "/" },
					{ label: "Venues", to: "/venues" },
					{ label: venue.name },
				]}
			/>
			<Flex bgColor="gray.200" p={[4, 6]} justifyContent="space-between">
				<Heading>{venue.name}</Heading>
				<FavouriteButton
					isFavourite={favourite}
					onToggle={handleFavouriteToggle}
				/>
			</Flex>
			<Stats venue={venue} />
			<Map location={venue.location} />
		</>
	);
};

const Stats: React.FC<{ venue: VenueProps }> = ({ venue }) => (
	<SimpleGrid
		columns={[1, 1, 2]}
		borderWidth="1px"
		borderRadius="md"
		m="6"
		p="4"
	>
		<Details label="Location" value={venue.city} helpText={venue.country} />
		{venue.capacity > 0 && (
			<Stat>
				<StatLabel display="flex">
					<Box as="span">Capacity</Box>
				</StatLabel>
				<StatNumber fontSize="xl">{venue.capacity}</StatNumber>
			</Stat>
		)}
	</SimpleGrid>
);

const Map: React.FC<{ location: { lat: number; lon: number } }> = ({
	location,
}) => (
	<AspectRatio ratio={16 / 5}>
		<Box
			as="iframe"
			src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
		/>
	</AspectRatio>
);

export default Venue;
