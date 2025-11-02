import { Body, Controller, Param, Post, Req, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { AppError } from 'src/shared/errors/app-erro';
import { ErrorCode } from 'src/shared/errors/erros-codes';
import { ResponseFormat } from 'src/shared/utils/ResponseFormat';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { ForgotPasswordDto } from './dto/forgotPasswordDto';
import { ResetPasswordDto } from './dto/resetPasswordDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}


    @Public()
    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
async signUp(@Response() res, @Body() signUpDto: SignUpDto){
   const response = await this.authService.register(signUpDto)
    if(!response) {
        throw new AppError(ErrorCode.BadRequest, 'request failed')

    }
    return ResponseFormat.successResponse(res, response, 'Success')
}


@Public()
@Post('signin')
@ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully authenticated.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
async signIn(@Response() res, @Body() signIn: LoginDto){
    const response = await this.authService.login(signIn)
      if(!response) {
        throw new AppError(ErrorCode.BadRequest, 'login failed')

    }
    return ResponseFormat.successResponse(res, response, 'successful')
}


@Post('refresh-token')
@Public()
async refreshToken(@Body() refreshToken: RefreshTokenDto, @Response() res){
    const response = await this.authService.refreshToken(refreshToken)
return ResponseFormat.successResponse(res, response, 'Token refreshed')
}

@Post('forgotPassword')
@Public()
async forgotPassword(@Body() email: ForgotPasswordDto, @Response() res, @Req() req){
  const {protocol, headers} = req;
  const host = headers.host;
  
    const response = await this.authService.forgotPassword(email, protocol, host);
  if(!response) {
        throw new AppError(ErrorCode.BadRequest, 'Request failed to send reset message')
    }
    return ResponseFormat.successResponse(res, {message:'Password reset link has been successfully sent to your email', link: response} , 'success')
}

@Post('resetPassword/:token')
@Public()
async resetPassword(@Param('token') token: string, @Body() resetData: ResetPasswordDto, @Response() res, @Req() req){
    const response = await this.authService.resetPassword(resetData, token);
    if (!response){
 throw new AppError(ErrorCode.BadRequest, 'Password reset failed')
    }

    return ResponseFormat.successResponse(res, response, 'Password reset successfully')
}

}
