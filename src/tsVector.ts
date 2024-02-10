import { customType } from 'drizzle-orm/pg-core';

function genExpWithWeights(input: string[]) {
	const columnExpressions = input.map((column, index) => {
		const weight = String.fromCharCode(index + 65);
		return `setweight(to_tsvector('english', coalesce(${column}, '')), '${weight}')`;
	});

	return `tsvector GENERATED ALWAYS AS (${columnExpressions.join(' || ')}) STORED`;
}

export const tsvector = customType<{
	data: string;
	config: { sources: string[]; weighted: boolean };
}>({
	dataType(config) {
		if (config) {
			const sources = config.sources.join(" || ' ' || ");
			return config.weighted
				? genExpWithWeights(config.sources)
				: `tsvector generated always as (to_tsvector('english', ${sources})) stored`;
		} else {
			return `tsvector`;
		}
	}
});
