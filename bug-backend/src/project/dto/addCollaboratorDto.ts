import { IsNotEmpty, IsString } from "class-validator";

export class AddCollaborator {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    collaborator: string

    @IsString()
    @IsNotEmpty()
    role: string
}