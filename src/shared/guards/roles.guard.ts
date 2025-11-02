import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SystemUsers } from "../enum/users.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requestRole= this.reflector.getAllAndOverride<SystemUsers[]>(ROLES_KEY,[
           context.getHandler(),
           context.getClass()
        ])

    if (!requestRole) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requestRole.includes(user.role);
    }

}