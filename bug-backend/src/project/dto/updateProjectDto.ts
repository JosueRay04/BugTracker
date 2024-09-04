import { bug } from "src/bug/bug.entity"
import { category } from "../project.entity"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateProjectDto {
    @IsNotEmpty()
    @IsString()
    name?: string

    @IsNotEmpty()
    @IsString()
    description?: string

    @IsNotEmpty()
    @IsString()
    expectedCompletionAt?: Date

    @IsNotEmpty()
    category?: category

    @IsNotEmpty()
    bug?: bug
}