import { Module, forwardRef } from '@nestjs/common';
import { BugController } from './bug.controller';
import { BugService } from './bug.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bug } from './bug.entity';
import { user } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';
import { ProjectModule } from 'src/project/project.module';
@Module({
  imports: [TypeOrmModule.forFeature([bug, user]), forwardRef(() => UserModule), forwardRef(() => ProjectModule), MailerModule],
  controllers: [BugController],
  providers: [BugService, UserService, MailerService]
})
export class BugModule {}
