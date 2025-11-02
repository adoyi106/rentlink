import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetPasswordDto{
    @ApiProperty({
        description: 'The new password fornthe user',
        example: 'NewStrongP@ssw0rd',
    })
    @IsString()
    newPassword: string;

}