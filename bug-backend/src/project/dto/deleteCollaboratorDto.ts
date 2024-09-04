import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCollaborator {
    @IsNotEmpty()
    @IsString()
    projectName: string

    @IsNotEmpty()
    @IsString()
    collaboratorName: string
}