import { IsEmail, IsNotEmpty } from "class-validator"

export class NewPassword {
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}