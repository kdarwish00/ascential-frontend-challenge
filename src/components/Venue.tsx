import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	Flex,
	Heading,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	SimpleGrid,
	Box,
	Spinner,
	AspectRatio,
	IconButton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import { useSeatGeek } from "../utils/useSeatGeek";
import {
	addFavourite,
	removeFavourite,
	isfavourite,
} from "../utils/favourites";

interface VenueProps {
	id: number;
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
	const [favourite, setfavourite] = useState<boolean>(false);

	useEffect(() => {
		if (venueId) {
			setfavourite(isfavourite(venueId));
		}
	}, [venueId]);

	const handleFavouriteToggle = () => {
		if (venueId) {
			if (favourite) {
				removeFavourite(venueId);
			} else {
				addFavourite(venueId);
			}
			setfavourite(!favourite);
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
				<IconButton
					aria-label="Add to favourites"
					icon={<StarIcon />}
					onClick={handleFavouriteToggle}
					colorScheme={favourite ? "yellow" : "gray"}
					variant="outline"
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
		<Stat>
			<StatLabel display="flex">
				<Box as="span">Location</Box>
			</StatLabel>
			<StatNumber fontSize="xl">{venue.city}</StatNumber>
			<StatHelpText>{venue.country}</StatHelpText>
		</Stat>
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
