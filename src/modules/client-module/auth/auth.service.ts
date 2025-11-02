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
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { ForgotPasswordDto } from './dto/forgotPasswordDto';
import { IPasswordResetToken } from '../users/schemas/forgot-password-token.schema'
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/resetPasswordDto';


const config = configuration()
@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('RefreshToken') private readonly refreshModel: Model<IRefreshToken>,
        @InjectModel('PasswordResetToken') private readonly passwordResetModel: Model<IPasswordResetToken>,
         private readonly jwtService: JwtService,
         private readonly mailService: MailService
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
        const tokens = await this.generateTokens(newUser._id.toString(), newUser.role )
 const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10)
 await this.refreshModel.create({
    token: hashedRefreshToken,
    userId: newUser._id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 })

 //send email
 await this.mailService.sendWelcomeMail(newUser.email, `${newUser.firstName} ${newUser.lastName}`, newUser.role)

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

        const tokens = await this.generateTokens(user._id, user.role)

 const hashedRefreshToken = await this.refreshHashing(tokens.refreshToken)
       //save hashed refresh token
 await this.refreshModel.updateOne({
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


    //Refresh Token
    async refreshToken(refreshTokenDto: RefreshTokenDto){
       const {refreshToken} = refreshTokenDto
        const storedToken = await this.refreshModel.findOne({expiryDate:{$gt: new Date()}})
        if (!storedToken){
            throw new AppError(ErrorCode.Unauthorized, 'Invalid or expired refresh token')
        }

        //compared new and old
        const isValid = await bcrypt.compare(refreshToken, storedToken.token)
        if (!isValid) {
            throw new AppError(ErrorCode.Unauthorized, 'Invalid refresh token')
        }

        const newTokens = await this.generateTokens(storedToken.userId, 'user')
        

        const newHashedToken= await this.refreshHashing(newTokens.refreshToken)
         await this.refreshModel.updateOne({
    token: newHashedToken,
    userId: storedToken.userId,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 })

 return {
    message:'Token refreshed successfully',
    ...newTokens
 }
    }


    //forgot password
async forgotPassword(emailDto: ForgotPasswordDto, protocol: string, host: string){
        //1. get the user
const {email}= emailDto
 const user = await this.userModel.findOne({email})

 if (!user) throw new AppError(ErrorCode.NotFound, 'User not found')

//2. generate reset token

const resetToken = await this.createPasswordResetToken(user._id.toString())
const resetUrl= `${protocol}://${host}/auth/resetPassword/${resetToken}`
//3. send reset email with reset url
 this.mailService.sendResetPasswordMail(user.email, `${user.firstName} ${user.lastName}`, resetUrl )

return resetUrl;
    }


    //Reset Password
    async resetPassword(resetData: ResetPasswordDto, token:string){
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await this.userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {$gt: new Date()}
        })

      
        if (!user){
            throw new AppError(ErrorCode.BadRequest, 'Token is invalid or has expired')
        }

        user.password = await bcrypt.hash(resetData.newPassword, 10);
        user.passwordResetToken =undefined;
        user.passwordResetExpires= undefined;

        await user.save();
 const newTokens = await this.generateTokens(user._id, 'user')
        

        const newHashedToken= await this.refreshHashing(newTokens.refreshToken)
         await this.refreshModel.updateOne({
    token: newHashedToken,
    userId: user._id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 })


return {
    user: {
        userId: user._id,
        ...user.toJSON(),
        ...newTokens
    }
}
    }
    async generateTokens(userId, role){
        const token = this.signInToken(userId, role)
       const refreshToken = this.refreshTokenGenerator(userId)
        return {
            accessToken: token,
            refreshToken: refreshToken
        }
    }

    private signInToken(id: string, role: string){
     return this.jwtService.sign(
      { id, role },
      {
        secret: config.jwt.secret,
        expiresIn: config.jwt.expiresIn,
      },
    );
  }
  private refreshTokenGenerator (id: string){
    return uuidv4();
  }
  async checkCorrectPassword(  candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword)
  }

   async refreshHashing(token: string ){
    const hashedRefreshToken = await bcrypt.hash(token, 10)
return hashedRefreshToken

  }
  
//generate resetToken
async createPasswordResetToken(userId: string) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await this.userModel.findByIdAndUpdate(
    userId,
    {
      passwordResetToken: hashedToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000, 
    },
    { validateBeforeSave: false },
  );

  return resetToken;
}
 
}


