import { IsNotEmpty, IsString } from "class-validator";

export class UpdateComentDto {
    @IsNotEmpty()
    @IsString()
    textComent?: string
}