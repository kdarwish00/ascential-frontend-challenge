/**
 * Task 1
 *
 * @param timestamp - The date or timestamp to format. Can be a Date object or a string/number representing a date/time.
 * @param [timeZone] - Optional. A string representing the time zone to use for formatting (e.g., "America/New_York"). Default to user timezone if not provided.
 * @returns A string representing the formatted date and time according to the specified time zone.
 */
export function formatDateTime(timestamp: Date, timeZone?: string): string {
	const dateTimeConfig: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		timeZoneName: "short",
		timeZone: timeZone,
	};

	const date = new Date(timestamp);

	return new Intl.DateTimeFormat("en-US", dateTimeConfig).format(date);
}
