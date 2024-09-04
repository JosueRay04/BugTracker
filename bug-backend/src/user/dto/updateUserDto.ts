import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { role } from "../user.entity"

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    userName?: string

    @IsNotEmpty()
    @IsString()
    firstName?: string

    @IsNotEmpty()
    @IsString()
    lastName?: string

    @IsNotEmpty()
    @IsEmail()
    email?: string

    @IsNotEmpty()
    @IsString()
    password?: string

    @IsNotEmpty()
    role?: role
}
