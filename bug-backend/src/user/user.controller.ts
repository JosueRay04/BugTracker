import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { user } from './user.entity';
import { UpdateUserDto } from './dto/updateUserDto';
import { JwtService } from '@nestjs/jwt';
import { RequestPassword } from './dto/requestPasswordDto';
import { RestorePassword } from './dto/restorePasswordDto';
import { NewPassword } from './dto/newPasswordDto';
import { ChangeEmail } from './dto/changeEmailDto';
import { JoinProject } from './dto/joinProjectDto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService, private jwtService: JwtService,) {}

    @Patch('requestPwd')
    requestPassword(@Body() requestPassword: RequestPassword) {
        return this.userService.requestPassword(requestPassword);
    }

    @Get()
    getUsers(): Promise<user[]> {
        return this.userService.getUsers();
    }

    @Get('id/:id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUser(id)
    }

    @Get('email/:email')
    getUserByEmail(@Param('email') email: string) {
        return this.userService.getUserByEmail(email);
    }
    
    @Post('createUser')
    createUser(@Body() newUser: CreateUserDto) {
        return this.userService.createUser(newUser)
    }

    @Post('login')
    async login(@Body() loginData: { userName: string; password: string }) {
        const { userName, password } = loginData;
        const user: user = await this.userService.getUserByUsername(userName);
        
        if (!user) {
            throw new HttpException(`User with ${userName} not found`, HttpStatus.NOT_FOUND);
        }
        
        // Comparar la contraseña proporcionada con la contraseña almacenada desencriptándola
        const isPasswordValid = await this.userService.comparePasswords(
            password,
            user.password
        );
        
        if (!isPasswordValid) {
            throw new HttpException(`Password invalid`, HttpStatus.NOT_FOUND);
        }
        // Generar un token JWT solo si las credenciales son válidas
        const payload = { userName: user.userName, sub: user.id };
        const accessToken = this.jwtService.sign(payload);
        
        return { access_token: accessToken };
    }

    @Patch('restorePwd')
    restorePassword(@Body() restorePassword: RestorePassword) {
        return this.userService.restorePassword(restorePassword);
    }

    @Patch('changePwd')
    newPassword(@Body() newPassword: NewPassword) {
        return this.userService.newPassword(newPassword);
    }

    @Patch('changeEmail')
    changeEmail(@Body() changeEmail: ChangeEmail) {
        return this.userService.changeEmail(changeEmail)
    }

    @Patch('joinProject')
    joinProject(@Body() joinProject: JoinProject) {
        return this.userService.joinProject(joinProject)
    }
    
    @Delete('id/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

    @Patch('id/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.userService.updateUser(id, user);
    }
}
