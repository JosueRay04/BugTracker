import { IsNotEmpty, IsString } from "class-validator";

export class ChangeRole {
    @IsNotEmpty()
    @IsString()
    projectName: string

    @IsNotEmpty()
    @IsString()
    collaboratorName: string

    @IsNotEmpty()
    @IsString()
    newRole: string
}