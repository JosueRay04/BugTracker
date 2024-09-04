import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bug } from './bug.entity';
import { Repository } from 'typeorm';
import { CreateBugDto } from './dto/createBugDto';
import { UpdateBugDto } from './dto/updateBugDto';
import { ChangeSummary } from './dto/changeSummaryDto';
import { ChangeDescription } from './dto/changeDescriptionDto';
import { ChangeState } from './dto/changeStateDto';
import { ChangePriority } from './dto/changePriorityDto';
import { ChangeSeverity } from './dto/changeSeverityDto';
import { AddCollaborator } from './dto/addCollaboratorDto';
import { UserService } from 'src/user/user.service';
import { user } from 'src/user/user.entity';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Injectable()
export class BugService {
    constructor
    (
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @InjectRepository(bug) private bugRepository: Repository<bug>) {
    }
    
    async createBug(bug: CreateBugDto) {
        console.log("datos recibidos", bug)
        const newBug = this.bugRepository.create(bug);
        this.bugRepository.save(newBug);
    }

    async getBugs() {
        return this.bugRepository.find({ relations: ['user'] });    
    }

    async getBug(id: number) {
        const bugFound = await this.bugRepository.findOne({where: { id }});

        if(!bugFound) {
            return new HttpException('Bug not found', HttpStatus.NOT_FOUND);
        }
    }

    async getBugsForUserAndCollaborations(username: string): Promise<bug[]> {
        const userBugs = await this.bugRepository.find({
            where: { userName: username },
        });
    
        const collaboratedBugs = await this.bugRepository
            .createQueryBuilder('bug')
            .where(`bug.collaborators LIKE :username`, { username: `%${username}%` })
            .getMany();
    
        // Combinar y eliminar duplicados (si es necesario)
        const allBugs = [...userBugs, ...collaboratedBugs];
        const uniqueBugs = Array.from(new Set(allBugs.map(bug => bug.id))).map(id => {
            return allBugs.find(bug => bug.id === id);
        });
    
        return uniqueBugs;
    }
    
    async deleteBug(id: number) {
        const result = await this.bugRepository.delete({ id });

        if(result.affected === 0) {
            return new HttpException('Bug not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async getBugByName(name: string) {
        const bugName = await this.bugRepository.findOne({where: { name }})

        if(!bugName) {
            throw new HttpException(`Bug with name: ${bugName.name} not found`, HttpStatus.NOT_FOUND);
        }

        /*if(bugName) {
            throw new HttpException(`Bug with name: ${bugName.name} found`, HttpStatus.NOT_FOUND);
        }*/

        return bugName;        
    }

    async getBugsByName(bugname: string) {
        return this.bugRepository
        .createQueryBuilder('bug')
        .where('bug.name LIKE :bugname', { bugname: `%${bugname}%` })
        .getMany();
    }



    async addCollaborator(addCollaborator: AddCollaborator) {
        const { nameBug, collaborator } = addCollaborator
        const bug: bug = await this.getBugByName(nameBug)
        const user: user = await this.userService.getUserByUsername(collaborator)

        if(!bug.collaborators) {
            bug.collaborators = []
        }

        if(!bug.collaborators.includes(user.userName)) {
            bug.collaborators.push(user.userName)

            await this.bugRepository.save(bug)
        }
    }

    async changeSummary(changeSummary: ChangeSummary) {
        const { name, newSummary } = changeSummary
        const bug: bug = await this.getBugByName(name)

        bug.summary = newSummary

        await this.bugRepository.save(bug)
    }

    async changeDescription(changeDescription: ChangeDescription) {
        const { name, newDescription } = changeDescription
        const bug: bug = await this.getBugByName(name)

        bug.description = newDescription

        await this.bugRepository.save(bug)
    }

    async changeState(changeState: ChangeState) {
        const { name, newState } = changeState
        const bug: bug = await this.getBugByName(name)

        bug.state = newState

        await this.bugRepository.save(bug)
    }

    async changePriority(changePriority: ChangePriority) {
        const { name, newPriority } = changePriority
        const bug: bug = await this.getBugByName(name)

        bug.priority = newPriority

        await this.bugRepository.save(bug)
    }

    async changeSeverity(changeSeverity: ChangeSeverity) {
        const { name, newSeverity } = changeSeverity
        const bug: bug = await this.getBugByName(name)

        bug.severity = newSeverity

        await this.bugRepository.save(bug)
    }

    async updateBug(id: number, bug: UpdateBugDto) {
        const bugFound = await this.bugRepository.findOne({where: { id }});

        if(!bugFound) {
            return new HttpException('Bug not found', HttpStatus.NOT_FOUND);
        }

        const updateBug = Object.assign(bugFound, bug);
        return this.bugRepository.save(updateBug);
    }

}
