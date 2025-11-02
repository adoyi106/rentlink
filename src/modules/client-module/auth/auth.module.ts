import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/libs/configuration';
import { JwtGuard } from './jwt.guard';
import { MailModule } from '../mail/mail.modules';

const config =  configuration()
@Module({
  imports:[forwardRef(()=>UsersModule), JwtModule.register({
    global: true,
    secret:config.jwt.secret,
    signOptions: {expiresIn: config.jwt.expiresIn }
  }), MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
})
export class AuthModule {}
