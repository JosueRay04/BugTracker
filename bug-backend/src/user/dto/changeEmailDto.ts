import { IsNotEmpty, IsEmail } from "class-validator"

export class ChangeEmail {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsEmail()
    newEmail: string
}