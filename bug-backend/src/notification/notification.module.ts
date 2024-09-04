import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { notification } from './notification.entity';
import { user } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([notification, user])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
