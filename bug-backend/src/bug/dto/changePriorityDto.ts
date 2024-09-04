import { IsNotEmpty, IsString } from "class-validator"
import { priority } from "../bug.entity"

export class ChangePriority {
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsNotEmpty()
    @IsString()
    newPriority: priority
}