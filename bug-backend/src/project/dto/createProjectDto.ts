import { IsNotEmpty, IsString } from "class-validator"

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    userName: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    expectedCompletionAt: string
    
    @IsNotEmpty()
    category: string
}