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
	IconButton,
	Image,
	Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import { useSeatGeek } from "../utils/useSeatGeek";
import { formatDateTime } from "../utils/formatDateTime";
import {
	addFavourite,
	removeFavourite,
	isFavourite,
} from "../utils/favourites";
import { type Venue } from "./Events";

interface EventInfoProps {
	event: {
		id: string;
		short_title: string;
		datetime_utc: Date;
		venue: Venue;
		url: string;
	};
}

interface RecommendationEvent {
	id: number;
	short_title: string;
	datetime_utc: Date;
	performers: {
		name: string;
		image: string;
	}[];
	venue: {
		name: string;
		display_location: string;
	};
	url: string;
}

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
		true // Indicate that this is for recommendations
	);

	// Handle loading state
	if (isLoading) {
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);
	}

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
				<IconButton
					aria-label={
						favourite
							? "Remove from favourites"
							: "Add to favourites"
					}
					icon={<StarIcon />}
					onClick={handleFavouriteToggle}
					colorScheme={favourite ? "yellow" : "gray"}
					variant="outline"
				/>
			</Flex>
			<EventInfo event={event} />

			{!isRecLoading && !recError && recommendations && (
				<Stack spacing="4" m="6">
					<Heading size="lg">Recommended Just for You</Heading>
					<SimpleGrid columns={[1, 2, 3]} spacing="4">
						{recommendations.recommendations.map(
							({
								event: recEvent,
							}: {
								event: RecommendationEvent;
							}) => (
								<Box
									key={recEvent.id}
									borderWidth="1px"
									borderRadius="md"
									p="4"
									maxWidth="400px"
								>
									<Image
										src={recEvent.performers[0].image}
										alt={recEvent.short_title}
										borderRadius="md"
										mb="4"
										width="100%"
									/>
									<Heading size="sm">
										{recEvent.short_title}
									</Heading>
									<Text>
										{recEvent.venue.name} -{" "}
										{recEvent.venue.display_location}
									</Text>
									<Stat>
										<StatLabel>Date</StatLabel>
										<StatNumber fontSize="md">
											{formatDateTime(
												recEvent.datetime_utc
											)}
										</StatNumber>
									</Stat>
									<Button
										as="a"
										href={recEvent.url}
										colorScheme="blue"
										mt="4"
									>
										View Event
									</Button>
								</Box>
							)
						)}
					</SimpleGrid>
				</Stack>
			)}
		</>
	);
};

const EventInfo: React.FC<EventInfoProps> = ({ event }) => (
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
				<StatNumber fontSize="xl">{event.venue.name_v2}</StatNumber>
				<StatHelpText>{event.venue.display_location}</StatHelpText>
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
);

export default Event;
