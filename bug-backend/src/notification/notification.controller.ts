import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { notification } from './notification.entity';
import { CreateNotificationDto } from './dto/createNotificationDto';

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get('getNotificationSent/:userName')
    getNotificationSent(@Param('userName') userName: string) {
        return this.notificationService.getNotificationSent(userName);
    }

    @Get('getNotificationReceived/:userName')
    getNotificationReceived(@Param('userName') userName: string) {
        return this.notificationService.getNotificationReceived(userName);
    }

    @Get('getNotificationsByUser/:userName')
    getNotificationsByUser(@Param('userName') userName: string) {
        return this.notificationService.getNotificationsByUser(userName);
    }

    @Get()
    getNotifications(): Promise<notification[]> {
        return this.notificationService.getNotifications();
    }

    @Get(':id')
    getNotification(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.getNotification(id);
    }

    @Post('createNotification')
    createNotification(@Body() newNotification: CreateNotificationDto) {
        this.notificationService.createNotification(newNotification);
    }

    @Delete('deleteNotification/:id')
    deleteNotification(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.deleteNotification(id);
    }
}
