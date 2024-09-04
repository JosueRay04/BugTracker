import { IsEmail, IsNotEmpty } from "class-validator"

export class RequestPassword {
    @IsNotEmpty()
    @IsEmail()
    email: string
}