import { type EventProps } from "../components/Events";

export const filterEventsByLocation = (
	events: EventProps[],
	locationFilter: string
) => {
	return events.filter(
		(event) =>
			!locationFilter || event.venue.display_location === locationFilter
	);
};

export const filterEventsByPerformer = (
	events: EventProps[],
	performerFilter: string
) => {
	return events.filter(
		(event) =>
			!performerFilter ||
			event.performers.some((performer) =>
				performer.name
					.toLowerCase()
					.includes(performerFilter.toLowerCase())
			)
	);
};

export const applyFilters = (
	events: EventProps[],
	locationFilter: string,
	performerFilter: string
) => {
	return filterEventsByPerformer(
		filterEventsByLocation(events, locationFilter),
		performerFilter
	);
};
