import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './modules/client-module/auth/auth.module';
import { UsersController } from './modules/client-module/users/users.controller';
import { DbModule } from './modules/db/db.module';
import { UsersModule } from './modules/client-module/users/users.module';

@Module({
  imports: [AuthModule, DbModule, UsersModule],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
