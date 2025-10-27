import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/libs/configuration';

const config =  configuration()
@Module({
  imports:[UsersModule, JwtModule.register({
    global: true,
    secret:config.jwt.secret,
    signOptions: {expiresIn: config.jwt.expiresIn }
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
