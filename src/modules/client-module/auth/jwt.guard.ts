import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import configuration from "src/libs/configuration";
import { AppError } from "src/shared/errors/app-erro";
import { ErrorCode } from "src/shared/errors/erros-codes";

const config = configuration()
@Injectable()
export class JwtGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean {
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