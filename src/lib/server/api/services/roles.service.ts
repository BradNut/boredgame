import {inject, injectable} from "@needle-di/core";
import {RolesRepository} from "$lib/server/api/repositories/roles.repository";

@injectable()
export class RolesService {
	constructor(
			private rolesRepository = inject(RolesRepository)
	) { }


	async findOneByNameOrThrow(name: string) {
		return this.rolesRepository.findOneByNameOrThrow(name);
	}
}