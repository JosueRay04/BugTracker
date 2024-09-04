import { IsNotEmpty, IsString } from "class-validator"

export class ChangeSummary {
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsNotEmpty()
    @IsString()
    newSummary: string
}