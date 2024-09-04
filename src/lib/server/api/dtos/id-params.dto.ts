import { z } from "zod";

export const IdParamsDto = z.object({
	id: z.trim().number(),
});