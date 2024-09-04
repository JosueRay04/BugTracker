import { IsNotEmpty, IsString } from "class-validator"

export class CreateNotificationDto {
    @IsNotEmpty()
    @IsString()
    message: string

    @IsNotEmpty()
    @IsString()
    sender?: string

    @IsNotEmpty()
    @IsString()
    recipient?: string
}