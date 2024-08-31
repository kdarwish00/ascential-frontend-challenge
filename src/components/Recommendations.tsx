import React from "react";
import {
	Box,
	Button,
	Heading,
	Image,
	SimpleGrid,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
	Text,
} from "@chakra-ui/react";
import { formatDateTime } from "../utils/formatDateTime";

interface Performer {
	type: string;
	name: string;
	image: string;
	id: number;
	images: {
		huge: string;
	};
}

interface Venue {
	name: string;
	display_location: string;
}

interface RecommendationEvent {
	id: number;
	datetime_utc: Date;
	venue: Venue;
	short_title: string;
	url: string;
	performers: Performer[];
}

interface RecommendationsProps {
	recommendations: {
		recommendations: {
			event: RecommendationEvent;
		}[];
	};
}

const Recommendations: React.FC<RecommendationsProps> = ({
	recommendations,
}) => {
	// Access the events array safely
	const events = recommendations.recommendations || [];

	return (
		<Stack spacing="4" m="6">
			<Heading size="lg">Recommended Just for You</Heading>
			<SimpleGrid columns={[1, 2, 3]} spacing="4">
				{events.length > 0 ? (
					events.map(({ event }) => {
						// Access performers array safely
						const firstPerformer =
							event.performers.length > 0
								? event.performers[0]
								: null;

						return (
							<Box
								key={event.id}
								borderWidth="1px"
								borderRadius="md"
								p="4"
								maxWidth="400px"
							>
								{firstPerformer ? (
									<Image
										src={firstPerformer.image}
										alt={event.short_title}
										borderRadius="md"
										mb="4"
										width="100%"
									/>
								) : (
									<Box
										height="200px"
										bg="gray.200"
										borderRadius="md"
										mb="4"
									/>
								)}
								<Heading size="sm">{event.short_title}</Heading>
								<Text>
									{event.venue.name} -{" "}
									{event.venue.display_location}
								</Text>
								<Stat>
									<StatLabel>Date</StatLabel>
									<StatNumber fontSize="md">
										{formatDateTime(event.datetime_utc)}
									</StatNumber>
								</Stat>
								<Button
									as="a"
									href={event.url}
									colorScheme="blue"
									mt="4"
								>
									View Event
								</Button>
							</Box>
						);
					})
				) : (
					<Text>No recommendations available</Text>
				)}
			</SimpleGrid>
		</Stack>
	);
};

export default Recommendations;
