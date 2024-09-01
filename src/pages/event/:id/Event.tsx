import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
	Flex,
	Heading,
	SimpleGrid,
	Spinner,
	Button,
	Stack,
} from "@chakra-ui/react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Error from "../../../components/Error";
import { useSeatGeek } from "../../../utils/useSeatGeek";
import { formatDateTime } from "../../../utils/formatDateTime";
import Recommendations from "../../../components/Recommendations";
import FavouriteButton from "../../../components/FavouriteButton";
import {
	addFavourite,
	isFavourite,
	removeFavourite,
} from "../../../utils/favourites";
import Details from "../../../components/Deatils";

const Event: React.FC = () => {
	const { eventId } = useParams<{ eventId: string }>();
	const { data: event, error, isLoading } = useSeatGeek(`events/${eventId}`);
	const [favourite, setFavourite] = useState(
		eventId ? isFavourite(eventId, "EventFav") : false
	);

	const handleFavouriteToggle = () => {
		if (event) {
			if (favourite) {
				removeFavourite(event.id.toString(), "EventFav");
			} else {
				addFavourite(event.id.toString(), "EventFav");
			}
			setFavourite(!favourite);
		}
	};

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

	if (isLoading)
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner size="lg" />
			</Flex>
		);

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
					<Details
						label="Venue"
						value={event.venue.name_v2}
						helpText={event.venue.display_location}
					/>

					<Details
						label="Date"
						value={formatDateTime(
							event.datetime_utc,
							event.venue.timezone
						)}
						tooltip={formatDateTime(event.datetime_utc)}
					/>
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
