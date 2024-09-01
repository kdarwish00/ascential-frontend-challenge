import { type EventProps } from "../components/pages/events/Events";
import { type VenueProps } from "../components/pages/venues/Venues";

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

export const filterVenuesByLocation = (
	venues: VenueProps[],
	locationFilter: string
) => {
	return venues.filter(
		(venue) => !locationFilter || venue.display_location === locationFilter
	);
};

export const applyVenueFilter = (
	venues: VenueProps[],
	locationFilter: string
) => {
	return filterVenuesByLocation(venues, locationFilter);
};

export const applyEventFilters = (
	events: EventProps[],
	locationFilter: string,
	performerFilter: string
) => {
	return filterEventsByPerformer(
		filterEventsByLocation(events, locationFilter),
		performerFilter
	);
};
