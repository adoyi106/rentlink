import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppError } from 'src/shared/errors/app-erro';
import { ErrorCode } from 'src/shared/errors/erros-codes';
import { User } from '../users/schemas/user.schema';
import configuration from 'src/libs/configuration';
import { JwtService } from '@nestjs/jwt';
import { IRefreshToken } from '../users/schemas/refresh-token.schema';
import { LoginDto } from './dto/login.dto';


const config = configuration()
@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('RefreshToken') private readonly refreshModel: Model<IRefreshToken>,
         private readonly jwtService: JwtService
    ){
    }
    
    async register (signUpDto: SignUpDto){
        const { password,email,  ...rest} = signUpDto
        
        //check if a user exist
        const existingUser = await this.userModel.findOne({email})

        if (existingUser) {
            throw new AppError(ErrorCode.Conflict, 'User already exist')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
       
        const newUser = await this.userModel.create({
            ...rest,
            password: hashedPassword,
            email,
            
        })
        const tokens = await this.generateTokens(newUser._id.toString(), email )
 const hashedRefreshToken = await bcrypt.hash(tokens.refreshToke, 10)
 await this.refreshModel.create({
    token: hashedRefreshToken,
    userId: newUser._id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 })

return {
    message: 'User successfully registered',
    data:{
        userId: newUser._id,
    },
    ...tokens
}
    } 

    async login(signIn: LoginDto){
        const {email, password} = signIn

        if (!email || !password){
            throw new AppError(ErrorCode.BadRequest, 'Please provide email and password')
        }

        const user = await this.userModel.findOne({email}).select('+password')
        if (!user || !await this.checkCorrectPassword(password, user.password)){
            throw new AppError(ErrorCode.BadRequest, 'Please, this user doesnot exist!')
        }

        const tokens = await this.generateTokens(user._id, email)

 const hashedRefreshToken = await bcrypt.hash(tokens.refreshToke, 10)
 await this.refreshModel.create({
    token: hashedRefreshToken,
    userId: user._id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 })

 return {
    message: 'User successfully registered',
    data:{
        userId: user._id,
    },
    ...tokens
}

    }

    async generateTokens(userId, email){
        const token = this.signInToken(userId)
       const refreshToken = this.refreshTokenGenerator(userId)
        return {
            accessToke: token,
            refreshToke: refreshToken
        }
    }

    private signInToken(id: string){
     return this.jwtService.sign(
      { id },
      {
        secret: config.jwt.secret,
        expiresIn: config.jwt.expiresIn,
      },
    );
  }
  private refreshTokenGenerator (id){
    return uuidv4 ();
  }
  async checkCorrectPassword(  candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword)
  }
}


