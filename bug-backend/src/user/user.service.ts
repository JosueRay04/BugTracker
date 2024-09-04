import { HttpException, HttpStatus, Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import * as bcrypt from 'bcrypt' 
import { RequestPassword } from './dto/requestPasswordDto';
import { v4 } from 'uuid';
import { RestorePassword } from './dto/restorePasswordDto';
import { MailerService } from 'src/mailer/mailer.service';
import { NewPassword } from './dto/newPasswordDto';
import { ChangeEmail } from './dto/changeEmailDto';
import { ProjectService } from 'src/project/project.service';
import { JoinProject } from './dto/joinProjectDto';

@Injectable()
export class UserService {
    constructor
    (
        @Inject(forwardRef(() => ProjectService)) private projectService: ProjectService,
        @InjectRepository(user) private userRepository: Repository<user>, private mailerService: MailerService
    ) {}

    async createUser(user: CreateUserDto) {
        const userFound = await this.userRepository.findOne({where: { userName: user.userName}})
        
        if(userFound) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        const newUser = this.userRepository.create(user);
        this.userRepository.save(newUser);
    }

    async getUsers() {
        return this.userRepository.find({
            relations: ['projects']
        });
    }

    async getUser(id: number) {
        const userFound = await this.userRepository.findOne({where: { id }})
        
        if(!userFound) {
            throw new HttpException(`User with ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return userFound;
    }

    async getUserByEmail(email: string) {
        const userEmail = await this.userRepository.findOne({ where: { email } });
        
        if(!userEmail) {
            throw new HttpException(`User with email: ${email} not found`, HttpStatus.NOT_FOUND);
        }

        return userEmail;
    }

    public async getUserByUsername(userName: string) {
        const username = await this.userRepository.findOne({ where: { userName } });
        
        if(!username) {
            throw new HttpException(`User with name: ${userName} not found`, HttpStatus.NOT_FOUND);
        }

        return username;
    }

    /*async login( loginData: { userName: string; password: string }) {
        const { userName, password } = loginData;
        const user = await this.getUserByUsername(userName);
        
        if (!user) {
            throw new HttpException(`User with ${userName} not found`, HttpStatus.NOT_FOUND);
        }
        
        // Comparar la contraseña proporcionada con la contraseña almacenada desencriptándola
        const isPasswordValid = await this.comparePasswords(
            password,
            user.password
        );
        
        if (!isPasswordValid) {
            throw new HttpException(`Password invalid`, HttpStatus.NOT_FOUND);
        }
        // Generar un token JWT solo si las credenciales son válidas
        const payload = { userName: user.userName, sub: user.id };
        const accessToken = this.jwt.sign(payload);
        
        return { access_token: accessToken };
    }*/

    async comparePasswords(plainPassword: string, hashedPassword: string) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async deleteUser(id: number) {
        const result = await this.userRepository.delete({ id });

        if(result.affected === 0) {
            throw new HttpException(`User with ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return result;
    }

    async restorePassword(restorePassword: RestorePassword) {
        const { passwordToken, password } = restorePassword;
        const user: user = await this.getPasswordToken(passwordToken);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        this.sendPasswordToken(user.email, hashedPassword);
        /*user.restorePasswordToken = null;
        user.password = hashedPassword;
        this.userRepository.save(user);*/
        const updatedUser = Object.assign(user, {
            restorePasswordToken: null,
            password: hashedPassword,
        });
    
        await this.userRepository.update(user.id, updatedUser);
    }
    
    async requestPassword(requestPassword: RequestPassword) {
        const { email }  = requestPassword;
        const user = await this.getUserByEmail(email);

        if (!user) {
            // Handle case where user is not found based on the email
            throw new Error('User not found for the provided email');
        }

        //user.restorePasswordToken = v4()
        //this.userRepository.save(user);

        const restorePasswordToken = v4();
        const updatedUser = Object.assign(user, { restorePasswordToken });
    
        await this.userRepository.update(user.id, updatedUser);

        this.sendPasswordToken(user.email, user.restorePasswordToken)
    }

    async sendPasswordToken(email: string, hashedPassword: string) {
        const subject = 'Password reset token';
        const emailData = {
            to: email, 
            subject: subject,
            text: hashedPassword
        };
        return this.mailerService.sendMail(emailData.to, emailData.subject, emailData.text);
    }

    async getPasswordToken(newPasswordToken: string) {
        const userWithToken = await this.userRepository.findOne({ where: { restorePasswordToken: newPasswordToken } });
        
        if (!userWithToken) {
            throw new HttpException(`User with password token ${newPasswordToken} not found`, HttpStatus.NOT_FOUND);
        }

        return userWithToken;
    }

    async joinProject(joinProject: JoinProject) {
        const { nameCollaborator, nameProject } = joinProject
        const projectName = await this.projectService.getCollaboratorByProject(nameProject)
        const user: user = await this.getUserByUsername(nameCollaborator)
        
        if (user.project_collaborations.includes(projectName.name)) {
            throw new HttpException(`User is already joined in project: ${projectName.name}`, HttpStatus.NOT_FOUND);
        }
        user.project_collaborations.push(projectName.name)

        this.userRepository.save(user)
    }

    async newPassword(newPassword: NewPassword) {
        const { email } = newPassword
        const user: user = await this.getUserByEmail(email);

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
    
        user.password = hashedPassword;
        await this.userRepository.save(user);

        return { message: 'Password changed successfully' };
    }

    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({where: { id }});
        
        if(!userFound) {
            return new HttpException(`User with ${id} not found`, HttpStatus.NOT_FOUND);
        }
        
        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }


    async changeEmail(changeEmail: ChangeEmail) {
        const { email, newEmail } = changeEmail
        const user: user = await this.getUserByEmail(email)

        user.email = newEmail
        
        await this.userRepository.save(user)
    }
}


