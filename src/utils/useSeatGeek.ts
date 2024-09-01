import useSWR from "swr";
import { fetcher } from "./fetcher";

function getSeatGeekUrl(
	path: string,
	options?: Record<string, string>,
	isRecommendations?: boolean
) {
	const searchParams = new URLSearchParams();

	if (isRecommendations) {
		const eventId = options?.["event.id"];
		const postalCode = options?.["postal_code"];

		if (eventId) {
			searchParams.append("events.id", eventId);
		}
		if (postalCode) {
			searchParams.append("postal_code", postalCode);
		}
	} else {
		Object.entries(options || {}).forEach(([key, value]) => {
			searchParams.append(key, value);
		});
	}

	searchParams.append(
		"client_id",
		import.meta.env.VITE_APP_SEAT_GEEK_API_CLIENT
	);
	searchParams.append(
		"client_secret",
		import.meta.env.VITE_APP_SEAT_GEEK_API_KEY
	);

	const SeatGeekApiBase = import.meta.env.VITE_SEATGEEK_API_URL;
	return `${SeatGeekApiBase}${path}?${searchParams.toString()}`;
}

export function useSeatGeek(
	path: string,
	options?: Record<string, string>,
	isRecommendations: boolean = false
) {
	const endpointUrl = getSeatGeekUrl(path, options, isRecommendations);
	return useSWR(path ? endpointUrl : null, fetcher);
}
