import React, { useState, useEffect } from "react";
import {
	SimpleGrid,
	Flex,
	Spinner,
	Heading,
	Text,
	Box,
	Card,
	CardBody,
	Stack,
	Image,
	LinkBox,
	LinkOverlay,
	IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import { useSeatGeek } from "../utils/useSeatGeek";
import { formatDateTime } from "../utils/formatDateTime";
import {
	getFavourites,
	addFavourite,
	removeFavourite,
	isfavourite,
} from "../utils/favourites";

export interface Performers {
	image: string;
}

export interface Venue {
	name_v2: string;
	display_location: string;
	timezone: string;
}

export interface EventProps {
	id: string;
	short_title: string;
	datetime_utc: Date;
	performers: Performers[];
	venue: Venue;
}

interface EventItemProps {
	event: EventProps;
	onFavouriteToggle: (id: string) => void;
	isFav: boolean;
}

const Events: React.FC = () => {
	const { data, error } = useSeatGeek("/events", {
		type: "concert",
		sort: "score.desc",
		per_page: "24",
	});

	const [favouriteEvents, setfavouriteEvents] = useState<EventProps[]>([]);

	useEffect(() => {
		if (data) {
			const favouriteIds = getFavourites();
			const filteredfavourites = data.events?.filter(
				(event: EventProps) => favouriteIds.includes(event.id)
			);
			setfavouriteEvents(filteredfavourites || []);
		}
	}, [data]);

	const handleFavouriteToggle = (id: string) => {
		if (isfavourite(id)) {
			removeFavourite(id);
		} else {
			addFavourite(id);
		}
		// Update the favourite events list after toggling
		const updatedfavouriteIds = getFavourites();
		const updatedfavouriteEvents =
			data.events?.filter((event: EventProps) =>
				updatedfavouriteIds.includes(event.id)
			) || [];
		setfavouriteEvents(updatedfavouriteEvents);
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
				items={[{ label: "Home", to: "/" }, { label: "Events" }]}
			/>

			{favouriteEvents.length > 0 && (
				<>
					<Heading size="lg" m="6">
						Your Favourite Events
					</Heading>
					<SimpleGrid spacing="6" m="6" minChildWidth="350px">
						{favouriteEvents.map((event: EventProps) => (
							<EventItem
								key={event.id}
								event={event}
								onFavouriteToggle={handleFavouriteToggle}
								isFav={true}
							/>
						))}
					</SimpleGrid>
				</>
			)}

			<Heading size="lg" m="6">
				All Events
			</Heading>
			<SimpleGrid spacing="6" m="6" minChildWidth="350px">
				{data.events?.map((event: EventProps) => (
					<EventItem
						key={event.id}
						event={event}
						onFavouriteToggle={handleFavouriteToggle}
						isFav={isfavourite(event.id)}
					/>
				))}
			</SimpleGrid>
		</>
	);
};

const EventItem: React.FC<EventItemProps> = ({
	event,
	onFavouriteToggle,
	isFav,
}) => (
	<LinkBox
		as={Card}
		variant="outline"
		overflow="hidden"
		bg="gray.50"
		borderColor="gray.200"
		_hover={{ bg: "gray.100" }}
		maxWidth="500px"
	>
		<Image src={event.performers[0].image} />
		<CardBody>
			<Stack spacing="2">
				<Flex align="center" justify="space-between">
					<Heading size="md">
						<LinkOverlay as={Link} to={`/events/${event.id}`}>
							{event.short_title}
						</LinkOverlay>
					</Heading>
					<IconButton
						aria-label={
							isFav
								? "Remove from favourites"
								: "Add to favourites"
						}
						icon={<StarIcon />}
						onClick={() => {
							console.log(
								`Toggling favourite for event ${event.id}`
							); // Debugging
							onFavouriteToggle(event.id);
						}}
						colorScheme={isFav ? "yellow" : "gray"}
						variant="outline"
					/>
				</Flex>
				<Box>
					<Text fontSize="sm" color="gray.600">
						{event.venue.name_v2}
					</Text>
					<Text fontSize="sm" color="gray.600">
						{event.venue.display_location}
					</Text>
				</Box>
				<Text
					fontSize="sm"
					fontWeight="bold"
					color="gray.600"
					justifySelf={"end"}
				>
					{formatDateTime(event.datetime_utc)}
				</Text>
			</Stack>
		</CardBody>
	</LinkBox>
);

export default Events;
