import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelName, UserSchema } from './schemas/user.schema';
import { RefreshTokenModelName, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { PasswordResetTokenModel, PasswordResetTokenSchema } from './schemas/forgot-password-token.schema';

@Module({
     imports: [
        MongooseModule.forFeature([
         {name: UserModelName, schema: UserSchema},
         { name: RefreshTokenModelName, schema: RefreshTokenSchema },
        { name: PasswordResetTokenModel, schema: PasswordResetTokenSchema },]

        ),
       forwardRef(()=>AuthModule) ,
    ],
    controllers:[UsersController],
    providers:[UserService],
    exports:[MongooseModule, UserService]
})
export class UsersModule {
   
}
