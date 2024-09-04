import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { project } from './project.entity';
import { user } from 'src/user/user.entity';
import { bug } from 'src/bug/bug.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MailerModule } from 'src/mailer/mailer.module'; 
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([project, user, bug]), MailerModule, forwardRef(() => UserModule)],
  controllers: [ProjectController],
  providers: [ProjectService, UserService, MailerService],
  exports: [ProjectService]
})
export class ProjectModule {}
