import { IsEmail, IsNotEmpty, IsUUID } from "class-validator"

export class RestorePassword {
    @IsNotEmpty()
    @IsUUID('4')
    passwordToken: string

    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}