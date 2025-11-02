import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './modules/client-module/auth/auth.module';
import { UsersController } from './modules/client-module/users/users.controller';
import { DbModule } from './modules/db/db.module';
import { UsersModule } from './modules/client-module/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/client-module/auth/jwt.guard';
import { RoleGuard } from './shared/guards/roles.guard';

@Module({
  imports: [AuthModule, DbModule, UsersModule],
  controllers: [UsersController],
  providers: [
    {provide: APP_GUARD, useClass: JwtGuard},
    {provide: APP_GUARD,useClass: RoleGuard }
  ],
})
export class AppModule {}
