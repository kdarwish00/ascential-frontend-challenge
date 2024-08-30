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
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import { useSeatGeek } from "../utils/useSeatGeek";
import { formatDateTime } from "../utils/formatDateTime";
import {
	addFavourite,
	removeFavourite,
	isfavourite,
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

const Event: React.FC = () => {
	const { eventId } = useParams();
	const { data: event, error } = useSeatGeek(`events/${eventId}`);
	const [favourite, setfavourite] = useState(false);

	useEffect(() => {
		if (event) {
			const isEventfavourite = isfavourite(event.id);
			setfavourite(isEventfavourite);
		}
	}, [event]);

	const handleFavouriteToggle = () => {
		if (event) {
			if (favourite) {
				removeFavourite(event.id);
			} else {
				addFavourite(event.id);
			}
			setfavourite(!favourite);
		}
	};

	if (error) return <Error />;

	if (!event) {
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
					onClick={() => {
						handleFavouriteToggle();
					}}
					colorScheme={favourite ? "yellow" : "gray"}
					variant="outline"
				/>
			</Flex>
			<EventInfo event={event} />
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
			<Button as={"a"} href={event.url} minWidth="0">
				Buy Tickets
			</Button>
		</Flex>
	</Stack>
);

export default Event;
