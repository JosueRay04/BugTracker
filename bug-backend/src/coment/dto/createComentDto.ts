import { IsNotEmpty, IsString } from "class-validator"
import { bug } from "src/bug/bug.entity"
import { user } from "src/user/user.entity"

export class CreateComentDto {
    @IsNotEmpty()
    user: user
    
    @IsNotEmpty()
    @IsString()
    textComent: string

    @IsNotEmpty()
    bug: bug
}