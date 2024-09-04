import { IsNotEmpty, IsString } from "class-validator"
import { severity } from "../bug.entity"

export class ChangeSeverity {
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsNotEmpty()
    @IsString()
    newSeverity: severity
}