import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { notification } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/createNotificationDto';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(notification) private notificationRepository: Repository<notification>) {

    }

    async createNotification(notification: CreateNotificationDto) {
        const newNotification = this.notificationRepository.create(notification);
        this.notificationRepository.save(newNotification);
    }

    async getNotifications() {
        return this.notificationRepository.find();
    }

    async getNotification(id: number) {
        const notificationFound = await this.notificationRepository.findOne({where: { id }})

        if(!notificationFound) {
            return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }
    }

    async getNotificationSent(userName: string) {
        const notificationFound = await this.notificationRepository.find({where: { sender: userName }})

        if(!notificationFound) {
            return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }

        return notificationFound;
    }

    async getNotificationReceived(userName: string) {
        const notificationFound = await this.notificationRepository.find({where: { recipient: userName }})

        if(!notificationFound) {
            return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }

        return notificationFound;
    }

    async getNotificationsByUser(userName: string) {
        const sentNotifications = await this.notificationRepository.find({ where: { sender: userName } });
        const receivedNotifications = await this.notificationRepository.find({ where: { recipient: userName } });

        const allNotifications = [...sentNotifications, ...receivedNotifications];

        if (allNotifications.length === 0) {
            return Promise.reject(new HttpException('Notifications not found', HttpStatus.NOT_FOUND));
        }

        return allNotifications;
    }

    async deleteNotification(id: number) {
        const result = await this.notificationRepository.delete({ id });

        if(result.affected === 0) {
            return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }
}
