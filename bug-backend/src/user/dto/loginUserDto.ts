import { IsNotEmpty, IsString } from "class-validator";

export class LoginUser {
    @IsNotEmpty()
    @IsString()
    userName: string

    @IsNotEmpty()
    @IsString()
    password: string
}