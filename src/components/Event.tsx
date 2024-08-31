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
	Button,
	Stack,
	Tooltip,
} from "@chakra-ui/react";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import { useSeatGeek } from "../utils/useSeatGeek";
import { formatDateTime } from "../utils/formatDateTime";
import {
	addFavourite,
	removeFavourite,
	isFavourite,
} from "../utils/favourites";
import Recommendations from "./Recommendations";
import FavouriteButton from "./FavouriteButton";

const Event: React.FC = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const { data: event, error, isLoading } = useSeatGeek(`events/${eventId}`);
	const [favourite, setFavourite] = useState(false);

	useEffect(() => {
		if (event) {
			const isEventFavourite = isFavourite(event.id);
			setFavourite(isEventFavourite);
		}
	}, [event]);

	const handleFavouriteToggle = () => {
		if (event) {
			if (favourite) {
				removeFavourite(event.id);
			} else {
				addFavourite(event.id);
			}
			setFavourite(!favourite);
		}
	};

	// Fetch recommendations
	const {
		data: recommendations,
		error: recError,
		isLoading: isRecLoading,
	} = useSeatGeek(
		"recommendations",
		{
			"event.id": event?.id || "",
			postal_code: event?.venue?.postal_code || "",
		},
		true
	);

	// Handle loading state
	if (isLoading)
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);

	// Handle error state
	if (error) {
		return <Error />;
	}

	return (
		<>
			<Breadcrumbs
				items={[
					{ label: "Home", to: "/" },
					{ label: "Events", to: "/events" },
					{ label: event.short_title },
				]}
			/>
			<Flex bgColor="gray.200" p={[4, 6]} justifyContent="space-between">
				<Heading>{event.short_title}</Heading>
				<FavouriteButton
					isFavourite={favourite}
					onToggle={handleFavouriteToggle}
				/>
			</Flex>
			<Stack spacing="6" m="6">
				<SimpleGrid
					columns={[1, 1, 2]}
					borderWidth="1px"
					borderRadius="md"
					p="4"
				>
					<Stat>
						<StatLabel display="flex">
							<Box as="span">Venue</Box>
						</StatLabel>
						<StatNumber fontSize="xl">
							{event.venue.name_v2}
						</StatNumber>
						<StatHelpText>
							{event.venue.display_location}
						</StatHelpText>
					</Stat>
					<Stat>
						<StatLabel display="flex">
							<Box as="span">Date</Box>
						</StatLabel>
						<Tooltip label={formatDateTime(event.datetime_utc)}>
							<StatNumber fontSize="xl">
								{formatDateTime(
									event.datetime_utc,
									event.venue.timezone
								)}
							</StatNumber>
						</Tooltip>
					</Stat>
				</SimpleGrid>
				<Flex>
					<Button as="a" href={event.url} minWidth="0">
						Buy Tickets
					</Button>
				</Flex>
			</Stack>

			{!isRecLoading && !recError && recommendations && (
				<Recommendations recommendations={recommendations} />
			)}
		</>
	);
};

export default Event;
