import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { CreateBugDto } from './dto/createBugDto';
import { BugService } from './bug.service';
import { bug } from './bug.entity';
import { UpdateBugDto } from './dto/updateBugDto';
import { ChangeSummary } from './dto/changeSummaryDto';
import { ChangeDescription } from './dto/changeDescriptionDto';
import { ChangeState } from './dto/changeStateDto';
import { ChangePriority } from './dto/changePriorityDto';
import { ChangeSeverity } from './dto/changeSeverityDto';
import { AddCollaborator } from './dto/addCollaboratorDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('bug')
export class BugController {
    constructor(private bugService: BugService) {}

    @Get('getBugsForUserAndCollaborations/:userName')
    getBugsForUserAndCollaborations(@Param('userName') userName: string) {
        return this.bugService.getBugsForUserAndCollaborations(userName);
    }
    @Get()
    getUsers(): Promise<bug[]> {
        return this.bugService.getBugs();
    }
    
    @Get(':id')
    getBug(@Param('id', ParseIntPipe) id: number) {
        return this.bugService.getBug(id);
    }

    @Get('name/:bugname')
    getBugByName(@Param('bugname') name: string) {
        return this.bugService.getBugByName(name);
    }

    @Get('/name/like/:bugname')
    async getBugsByName(@Param('bugname') bugname: string) {
    const bugs = await this.bugService.getBugsByName(bugname);
    return bugs;
    }

    @Post('createBug')
    createBug(@Body() newBug: CreateBugDto) {
        this.bugService.createBug(newBug);
    }

    @Patch('addCollaborator')
    addCollaborator(@Body() addCollaborator: AddCollaborator) {
        return this.bugService.addCollaborator(addCollaborator)
    }

    @Patch('changeSummary')
    changeSummary(@Body() changeSummary: ChangeSummary) {
        return this.bugService.changeSummary(changeSummary)
    }

    @Patch('changeDescription')
    changeDescription(@Body() changeDescription: ChangeDescription) {
        return this.bugService.changeDescription(changeDescription)
    }

    @Patch('changeState')
    changeState(@Body() changeState: ChangeState) {
        return this.bugService.changeState(changeState)
    }

    @Patch('changePriority')
    changePriority(@Body() changePriority: ChangePriority) {
        return this.bugService.changePriority(changePriority)
    }

    @Patch('changePriority')
    changeSeverity(@Body() changeSeverity: ChangeSeverity) {
        return this.bugService.changeSeverity(changeSeverity)
    }

    @Patch(':id')
    updateBug(@Param('id', ParseIntPipe) id: number, @Body() bug: UpdateBugDto) {
        return this.bugService.updateBug(id, bug);
    }

    @Delete('deleteBug/:id')
    deleteBug(@Param('id') id: number){
        return this.bugService.deleteBug(id);
    }
}
