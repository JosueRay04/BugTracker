import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentModule } from './coment/coment.module';
import { BugModule } from './bug/bug.module';
import { ProjectModule } from './project/project.module';
import { NotificationModule } from './notification/notification.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mint00',
      database: 'bugtracker',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ComentModule,
    BugModule,
    ProjectModule,
    NotificationModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }










