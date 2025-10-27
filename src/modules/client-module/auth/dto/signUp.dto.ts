import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString,  MinLength} from "class-validator";
import { Match } from "src/shared/decorators/match.decorator";
import { SystemUsers } from "src/shared/enum/users.enum";

export class SignUpDto {
    @ApiProperty({example: 'Doe'})
    @IsString({message: 'provide a first name'})
    firstName: string;

    @ApiProperty({example:'John'})
    @IsString({message:" Last name must be provided"})
    lastName: string;

    @ApiProperty({example:'johndoe@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'password123'})
    @IsString({message: 'Password must be provided'})
    @MinLength(6, {message:'Password must be minimum of 6 leters'})
    password: string;

    @ApiProperty({example: 'password123'})
    @IsString({message: 'Password must be provided'})
    @MinLength(6)
    @Match('password', {message: 'Passwords doesnot match'})
    passwordConfirm: string;

    @ApiProperty({example: 'male'})
    @IsString({message:' gender must be provided'})
    gender: string

    @ApiProperty({example: 'landlord'})
    @IsOptional()
    role?: SystemUsers;

    @ApiProperty({example: 'N0.11 chicken republic street'})
    @IsOptional()
    address?: string;

    @ApiProperty({example: '+234908734589'})
    @IsOptional()
    phone?: string
}