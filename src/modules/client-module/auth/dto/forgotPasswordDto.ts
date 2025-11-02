import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ForgotPasswordDto{
    @ApiProperty({
        description: 'This should be the email of the user',
        example: 'johndoe@gmail.com',
      })
      @IsString()
    email: string;

    
}