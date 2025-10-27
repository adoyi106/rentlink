import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelName, UserSchema } from './schemas/user.schema';
import { RefreshTokenModelName, RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
     imports: [
        MongooseModule.forFeature([{name: UserModelName, schema: UserSchema},          { name: RefreshTokenModelName, schema: RefreshTokenSchema },],

        )
    ],
    exports:[MongooseModule]
})
export class UsersModule {
   
}
