import { IsNotEmpty, IsString } from "class-validator";

export class ChangeDescription {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    newDescription: string
}