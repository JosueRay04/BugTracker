import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private APPUrl: string
  private APIUrl: string
  
  constructor(private http: HttpClient) {
    this.APPUrl = environment.endpoint;
    this.APIUrl = 'user'
  }

  sign(user: User): Observable<any> {
    return this.http.post(`${this.APPUrl}${this.APIUrl}/createUser`, user)
  }

  login(user: User): Observable<string> {
    return this.http.post<string>(`${this.APPUrl}${this.APIUrl}/login`, user)
  }

  requestPwd(user: User): Observable<any> {
    return this.http.patch(`${this.APPUrl}${this.APIUrl}/requestPwd`, user)
  }

  restorePwd(user: User): Observable<any> {
    return this.http.patch(`${this.APPUrl}${this.APIUrl}/restorePwd`, user)
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.APPUrl}${this.APIUrl}`)
  }
}
