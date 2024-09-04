import { IsNotEmpty, IsString } from "class-validator";

export class AddCollaborator {
    @IsNotEmpty()
    @IsString()
    nameBug: string

    @IsNotEmpty()
    @IsString()
    collaborator: string
}