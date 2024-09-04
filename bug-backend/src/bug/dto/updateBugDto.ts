import { user } from "src/user/user.entity"
import { priority, severity, state } from "../bug.entity"
import { project } from "src/project/project.entity"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateBugDto {
    @IsNotEmpty()
    @IsString()
    summary?: string

    @IsNotEmpty()
    @IsString()
    description?: string

    @IsNotEmpty()
    @IsString()
    state?: state

    @IsNotEmpty()
    @IsString()
    priority?: priority

    @IsNotEmpty()
    @IsString()
    severity?: severity

    @IsNotEmpty()
    @IsString()
    finishedAt?: Date

    @IsNotEmpty()
    user?: user

    @IsNotEmpty()
    project?: project

    @IsNotEmpty()
    @IsString()
    Answer?: string

    @IsNotEmpty()
    @IsString()
    imageAnswer?: string
}