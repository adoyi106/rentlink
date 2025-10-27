import { Body, Controller, Post, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { AppError } from 'src/shared/errors/app-erro';
import { ErrorCode } from 'src/shared/errors/erros-codes';
import { ResponseFormat } from 'src/shared/utils/ResponseFormat';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
async signUp(@Response() res, @Body() signUpDto: SignUpDto){
   const response = await this.authService.register(signUpDto)
    if(!response) {
        throw new AppError(ErrorCode.BadRequest, 'request failed')

    }
    return ResponseFormat.successResponse(res, response, 'Success')
}

@Post('signin')
@ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully authenticated.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
async signIn(@Response() res, @Body() signIn: LoginDto){
    const response = await this.authService.login(signIn)
    return ResponseFormat.successResponse(res, response, 'successful')
}


}
