import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "bugwhispererinc@gmail.com",
                pass: "rdgykxwmqdfzlgne",
            },
        });

        this.transporter.verify().then(() => {
            console.log('Ready for send Emails');
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: "bugwhispererinc@gmail.com",
            to,
            subject,
            text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: " + info.response);
            return info;
        } catch (error) {
            console.error("Error sending email: " + error);
            throw error;
        }
    }
}
