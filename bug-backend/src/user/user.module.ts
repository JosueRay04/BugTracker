import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from './user.entity';
import { coment } from 'src/coment/coment.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module'; 
import { MailerService } from 'src/mailer/mailer.service';
import { project } from 'src/project/project.entity';
import { ProjectModule } from 'src/project/project.module';
import { ProjectService } from 'src/project/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([user, coment, project]), JwtModule.register({secret: '1213'}), MailerModule, forwardRef(() => ProjectModule)],
  controllers: [UserController],
  providers: [UserService, MailerService, ProjectService],
  exports: [UserService]
})
export class UserModule {}
