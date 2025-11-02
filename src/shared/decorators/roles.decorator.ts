import { SetMetadata } from "@nestjs/common";
import { SystemUsers } from "../enum/users.enum";

export const ROLES_KEY ='roles';
export const Roles=(...roles: SystemUsers[])=>SetMetadata(ROLES_KEY, roles)