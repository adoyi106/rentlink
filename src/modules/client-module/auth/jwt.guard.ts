import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import configuration from "src/libs/configuration";
import { IS_PUBLIC_KEY } from "src/shared/decorators/public.decorator";
import { AppError } from "src/shared/errors/app-erro";
import { ErrorCode } from "src/shared/errors/erros-codes";

const config = configuration()
@Injectable()
export class JwtGuard implements CanActivate{
    constructor(private jwtService: JwtService,
        private reflector: Reflector
    ){}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.Unauthorized ,'Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    try {
      
      const payload = this.jwtService.verify(token, { secret: config.jwt.secret });

     
      request.user = payload;

      return true;
    } catch (err) {
      throw new AppError(ErrorCode.Unauthorized, 'Invalid or expired token');
    }
  }
}