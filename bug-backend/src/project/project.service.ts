import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository  } from 'typeorm';
import { project } from './project.entity';
import { CreateProjectDto } from './dto/createProjectDto';
import { UpdateProjectDto } from './dto/updateProjectDto';
import { ChangeDescription } from './dto/changedescriptionDto';
import { ChangeDateCompletion } from './dto/changeDateCompletionDto';
import { ChangeCategory } from './dto/changeCategoryDto';
import { AddCollaborator } from './dto/addCollaboratorDto';
import { UserService } from 'src/user/user.service';
import { user } from 'src/user/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { DeleteCollaborator } from './dto/deleteCollaboratorDto';
import { ChangeRole } from './dto/changeRoleDto';

@Injectable()
export class ProjectService {
    constructor
    (
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @InjectRepository(project) private projectRepository: Repository<project>, private mailerService: MailerService,
        @InjectRepository(project) private userRepository: Repository<user>
    ) {}

    async createProject(project: CreateProjectDto) {
        const projectFound = await this.projectRepository.findOne({ where: { name: project.name } });
    
        if (projectFound) {
            return new HttpException('Project already exists', HttpStatus.CONFLICT);
        }
    
        const user = await this.userRepository.findOne({ where: { userName: project.userName } });
    
        /*if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }*/
    
        // Asociar el usuario al proyecto y guardar el proyecto nuevamente
        const newProject = this.projectRepository.create({
            ...project,
            fk_user: user,
        });
        
        await this.projectRepository.save(newProject);
    }
    
    async getProjects() {
        const project = await this.projectRepository.find()
        return project;
    }
    
    async getAllCollaborators() {
        const projects = await this.projectRepository.find();
        const collaboratorsWithDetails = projects.flatMap((project) =>
            project.collaborators.map((collaborator) => ({
                collaborator: collaborator.collaborator,
                project: project.name, // Cambia esto si el nombre del proyecto está en otro campo
                role: collaborator.role,
            })),
        );
        return collaboratorsWithDetails;
    }

    async deleteCollaboratorFromProject(deleteCollaborator: DeleteCollaborator): Promise<void> {
        const { projectName, collaboratorName } = deleteCollaborator;
    
        // Buscar el proyecto por nombre
        const project = await this.projectRepository.findOne({ where: { name: projectName } });
    
        if (!project) {
            throw new HttpException(`Project with name: ${projectName} not found`, HttpStatus.NOT_FOUND);
        }
    
        // Filtrar la lista de colaboradores para excluir al colaborador que se va a eliminar
        const updatedCollaborators = project.collaborators.filter(
            (collaborator) => collaborator.collaborator !== collaboratorName,
        );
    
        // Actualizar la lista de colaboradores del proyecto con la nueva lista filtrada
        project.collaborators = updatedCollaborators;
    
        // Guardar los cambios en la base de datos
        await this.projectRepository.save(project);
    }
    

    async getProject(id: number) {
        const projectFound = await this.projectRepository.findOne({where: { id }})
        
        if(!projectFound) {
            return new HttpException('Project not found', HttpStatus.NOT_FOUND);
        }
    }

    async getProjectByName(name: string) {
        const nameProject = await this.projectRepository.findOne({ where: { name }})

        if(!nameProject) {
            throw new HttpException(`Project with name: ${name} not found`, HttpStatus.NOT_FOUND);
        }

        return nameProject;
    }

    async getProjectByUser(userName: string) {
        const user = await this.projectRepository.find({where: { userName }});
    
        if (!user) {
            throw new HttpException(`User with name: ${userName} not found`, HttpStatus.NOT_FOUND);
        }
    
        return user;
    }    

// project.service.ts

    async getProjectsForUserAndCollaborations(username: string): Promise<project[]> {
        const userProjects = await this.projectRepository.find({
        where: { userName: username },
        });
    
        const collaboratedProjects = await this.projectRepository
        .createQueryBuilder('project')
        .where(`project.collaborators LIKE :username`, { username: `%${username}%` })
        .getMany();
    
        // Combinar y eliminar duplicados (si es necesario)
        const allProjects = [...userProjects, ...collaboratedProjects];
        const uniqueProjects = Array.from(new Set(allProjects.map(project => project.id))).map(id => {
        return allProjects.find(project => project.id === id);
        });
    
        return uniqueProjects;
    }

    public async getCollaboratorByProject(name: string) {
        const projectCollaborators: project = await this.getProjectByName(name)

        if(!projectCollaborators) {
            throw new HttpException(`Project with collaborators: ${projectCollaborators} not found`, HttpStatus.NOT_FOUND);
        }

        return projectCollaborators
    }

    async deleteProject(name: string) {
        const result = await this.projectRepository.delete({ name })

        if(result.affected === 0) {
            return new HttpException('Project not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async changeDescription(changeDescription: ChangeDescription) {
        const { name, newDescription } = changeDescription
        const project: project = await this.getProjectByName(name)

        project.description = newDescription

        await this.projectRepository.save(project)
    }

    async changeDate(changeDate: ChangeDateCompletion) {
        const { name, newDateCompletion } = changeDate
        const project: project = await this.getProjectByName(name)

        project.expectedCompletionAt = newDateCompletion

        await this.projectRepository.save(project)
    }

    async changeCategory(changeCategory: ChangeCategory) {
        const { name, newCategory } = changeCategory
        const project: project = await this.getProjectByName(name)

        project.category = newCategory

        await this.projectRepository.save(project)
    }

    async changeRole(changeRole: ChangeRole): Promise<void> {
        const { projectName, collaboratorName, newRole } = changeRole;
        const projectEntity = await this.projectRepository.findOne({ where: { name: projectName } });

        if (!projectEntity) {
            throw new HttpException(`Project with name: ${projectName} not found`, HttpStatus.NOT_FOUND);
        }

        const collaboratorIndex = projectEntity.collaborators.findIndex(
            (c) => c.collaborator === collaboratorName,
        );
    }
    
    async addCollaborator(addCollaborator: AddCollaborator) {
        const { name, collaborator, role } = addCollaborator;
        const project: project = await this.getProjectByName(name);
        const user: user = await this.userService.getUserByUsername(collaborator);

        if (!project.collaborators) {
            project.collaborators = [];
        }

        const existingCollaborator = project.collaborators.find((c) => c.collaborator === user.userName);

        if (!existingCollaborator) {
            // Agrega el nuevo colaborador al proyecto con su rol
            const newCollaborator = { name, collaborator: user.userName, role };
            project.collaborators.push(newCollaborator);

            await this.projectRepository.save(project);
        }
    }

    async updateProject(id: number, project: UpdateProjectDto) {
        const projectFound = await this.projectRepository.findOne({where: { id }});

        if(!projectFound) {
            return new HttpException('Project not found', HttpStatus.NOT_FOUND);
        }

        const updateProject = Object.assign(projectFound, project);
        return this.projectRepository.save(updateProject);
    }
}