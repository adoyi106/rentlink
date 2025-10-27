import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose'
import configuration from 'src/libs/configuration';

const config = configuration()
@Module({
    imports:[
        MongooseModule.forRootAsync({
            imports:[ConfigModule],
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URL');
                if (!uri) throw new Error('MONGODB_URL is not defined');
                return { uri };
            },
            inject: [ConfigService],
        })
    ],
})

export class DbModule {
    static forFeature(){
        [
            //  { name: 'Users', schema:  },
        ]
    }
}
