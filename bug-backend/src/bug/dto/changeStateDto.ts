import { IsNotEmpty, IsString } from "class-validator"
import { state } from "../bug.entity"

export class ChangeState {
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsNotEmpty()
    @IsString()
    newState: state
}