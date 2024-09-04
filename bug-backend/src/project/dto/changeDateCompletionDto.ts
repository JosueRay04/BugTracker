import { IsNotEmpty, IsString } from "class-validator";

export class ChangeDateCompletion {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    newDateCompletion: string
}