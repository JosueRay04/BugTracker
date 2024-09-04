import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { project } from './project.entity';
import { CreateProjectDto } from './dto/createProjectDto';
import { UpdateProjectDto } from './dto/updateProjectDto';
import { ChangeDescription } from './dto/changedescriptionDto';
import { ChangeDateCompletion } from './dto/changeDateCompletionDto';
import { ChangeCategory } from './dto/changeCategoryDto';
import { AddCollaborator } from './dto/addCollaboratorDto';
import { DeleteCollaborator } from './dto/deleteCollaboratorDto';
import { ChangeRole } from './dto/changeRoleDto';

@Controller('project')
export class ProjectController {
    constructor(private projectService: ProjectService) {}

    @Get('getAllCollaborators')
    async getAllCollaborators() {
        return await this.projectService.getAllCollaborators();
    }    

    @Get('getProjectsForUserAndCollaborations/:userName')
    getProjectsForUserAndCollaborations(@Param('userName') userName: string) {
        return this.projectService.getProjectsForUserAndCollaborations(userName);
    }

    @Get()
    getProjects(): Promise<project[]> {
        return this.projectService.getProjects();
    }

    @Get(':id')
    getProject(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.getProject(id);
    }

    @Get('getByUser/:userName')
    getProjectByUsername(@Param('userName') userName: string) {
        return this.projectService.getProjectByUser(userName);
    }
    
    @Post('createProject')
    createProject(@Body() newProject: CreateProjectDto) {
        this.projectService.createProject(newProject);
    }

    @Delete('deleteProject/:name')
    deleteProject(@Param('name') name: string) {
        return this.projectService.deleteProject(name);
    }

    @Patch('deleteCollaboratorFromProject')
    deleteCollaboratorFromProject(@Body() deleteCollaboratorFromProject: DeleteCollaborator) {
        return this.projectService.deleteCollaboratorFromProject(deleteCollaboratorFromProject);
    }    

    @Patch('changeDescription')
    changeDescription(@Body() changeDescription: ChangeDescription) {
        return this.projectService.changeDescription(changeDescription)
    }

    @Patch('changeDate')
    changeDate(@Body() changeDate: ChangeDateCompletion) {
        return this.projectService.changeDate(changeDate)
    }

    @Patch('changeCategory')
    changeCategory(@Body() changeCategory: ChangeCategory) {
        return this.projectService.changeCategory(changeCategory)
    }

    @Patch('addCollaborator')
    addColaborator(@Body() addColaborator: AddCollaborator) {
        return this.projectService.addCollaborator(addColaborator)
    }

    @Patch('changeRole')
    changeRole(@Body() changeRole: ChangeRole) {
        return this.projectService.changeRole(changeRole)
    }

    @Patch()
    updateProject(@Param('id', ParseIntPipe) id: number, @Body() project: UpdateProjectDto) {
        return this.projectService.updateProject(id, project);
    }
}
