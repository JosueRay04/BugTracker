import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../interfaces/notification';

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    private APPUrl: string;
    private APIUrl: string;

    constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.APPUrl = environment.endpoint;
        this.APIUrl = 'notification';
    }

    getNotificationsByUser(): Observable<any> {
        const userName = localStorage.getItem('userName');
        return this.http.get(`${this.APPUrl}${this.APIUrl}/getNotificationsByUser/${userName}`);
    }

    createNotification(notification: Notification): Observable<any> {
        return this.http.post(`${this.APPUrl}${this.APIUrl}/createNotification`, notification)
    }
    
    deleteNotification(id: number): Observable<any> {
        return this.http.delete(`${this.APPUrl}${this.APIUrl}/deleteNotification/${id}`)
    }

}
