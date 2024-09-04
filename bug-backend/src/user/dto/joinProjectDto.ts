import { IsNotEmpty, IsString } from "class-validator";

export class JoinProject {
    @IsNotEmpty()
    @IsString()
    nameProject: string

    @IsNotEmpty()
    @IsString()
    nameCollaborator: string
}