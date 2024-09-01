import React from "react";
import {
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Box,
	Tooltip,
} from "@chakra-ui/react";

interface DetailsProps {
	label: string;
	value: string;
	helpText?: string;
	tooltip?: string;
}

const Details: React.FC<DetailsProps> = ({
	label,
	value,
	helpText,
	tooltip,
}) => {
	return (
		<Stat>
			<StatLabel display="flex">
				<Box as="span">{label}</Box>
			</StatLabel>
			{tooltip ? (
				<Tooltip label={tooltip}>
					<StatNumber fontSize="xl">{value}</StatNumber>
				</Tooltip>
			) : (
				<StatNumber fontSize="xl">{value}</StatNumber>
			)}
			{helpText && <StatHelpText>{helpText}</StatHelpText>}
		</Stat>
	);
};

export default Details;
