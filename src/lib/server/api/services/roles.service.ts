import {inject, injectable} from "tsyringe";
import { RolesRepository } from "$lib/server/api/repositories/roles.repository";

@injectable()
export class RolesService {
	constructor(
			@inject(RolesRepository) private readonly rolesRepository: RolesRepository
	) { }


	async findOneByNameOrThrow(name: string) {
		return this.rolesRepository.findOneByNameOrThrow(name);
	}
}