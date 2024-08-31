import React, { useState, useEffect, ChangeEvent } from "react";
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
	Select,
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
	isFavourite,
} from "../utils/favourites";
import { applyFilters } from "../utils/filterEvents";

export interface Performers {
	name: string;
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
	const [locationFilter, setLocationFilter] = useState<string>("");
	const [performerFilter, setPerformerFilter] = useState<string>("");
	const [favouriteEvents, setFavouriteEvents] = useState<EventProps[]>([]);
	const [filteredEvents, setFilteredEvents] = useState<EventProps[]>([]);

	const { data, error } = useSeatGeek("/events", {
		type: "concert",
		sort: "score.desc",
		per_page: "24",
	});

	useEffect(() => {
		if (data) {
			const favouriteIds = getFavourites();
			const filteredFavourites = data.events?.filter(
				(event: EventProps) => favouriteIds.includes(event.id)
			);
			setFavouriteEvents(filteredFavourites || []);
		}
	}, [data]);

	useEffect(() => {
		if (data) {
			const filtered = applyFilters(
				data.events || [],
				locationFilter,
				performerFilter
			);
			setFilteredEvents(filtered);
		}
	}, [data, locationFilter, performerFilter]);

	const handleFavouriteToggle = (id: string) => {
		if (isFavourite(id)) {
			removeFavourite(id);
		} else {
			addFavourite(id);
		}
		const updatedFavouriteIds = getFavourites();
		const updatedFavouriteEvents =
			data.events?.filter((event: EventProps) =>
				updatedFavouriteIds.includes(event.id)
			) || [];
		setFavouriteEvents(updatedFavouriteEvents);
	};

	if (error) return <Error />;

	if (!data) {
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);
	}

	const events = data.events as EventProps[];

	const locations = [
		...new Set(events.map((event) => event.venue.display_location)),
	];
	const performers = [
		...new Set(
			events.flatMap((event) => event.performers.map((p) => p.name))
		),
	];

	return (
		<>
			<Breadcrumbs
				items={[{ label: "Home", to: "/" }, { label: "Events" }]}
			/>

			<Flex direction="column" m="6" gap="4">
				<Flex gap="4">
					<Select
						placeholder="Filter by location"
						value={locationFilter}
						onChange={(e: ChangeEvent<HTMLSelectElement>) =>
							setLocationFilter(e.target.value)
						}
					>
						<option value="">All Locations</option>
						{locations.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</Select>
					<Select
						placeholder="Filter by performer"
						value={performerFilter}
						onChange={(e: ChangeEvent<HTMLSelectElement>) =>
							setPerformerFilter(e.target.value)
						}
					>
						<option value="">All Performers</option>
						{performers.map((performer) => (
							<option key={performer} value={performer}>
								{performer}
							</option>
						))}
					</Select>
				</Flex>

				{favouriteEvents.length > 0 && (
					<>
						<Heading size="lg">Your Favourite Events</Heading>
						<SimpleGrid spacing="6" minChildWidth="350px">
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

				<Heading size="lg">All Events</Heading>
				<SimpleGrid spacing="6" minChildWidth="350px">
					{filteredEvents.map((event: EventProps) => (
						<EventItem
							key={event.id}
							event={event}
							onFavouriteToggle={handleFavouriteToggle}
							isFav={isFavourite(event.id)}
						/>
					))}
				</SimpleGrid>
			</Flex>
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
