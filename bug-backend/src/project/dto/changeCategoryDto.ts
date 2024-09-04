import { IsNotEmpty, IsString } from "class-validator";
import { category } from "../project.entity";

export class ChangeCategory {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    newCategory: category
}