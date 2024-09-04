import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  private APPUrl: string
  private APIUrl: string

  constructor(private http: HttpClient) {
    this.APPUrl = environment.endpoint;
    this.APIUrl = 'bug'
  }

  getBugs(): Observable<any[]> {
    return this.http.get<[]>(`${this.APPUrl}${this.APIUrl}`);
  }

  getBugsForUserAndCollaborations(): Observable<any> {
    const user = localStorage.getItem('userName')
    return this.http.get(`${this.APPUrl}${this.APIUrl}/getBugsForUserAndCollaborations/${user}`)
  }

  GetBugById(id: number): Observable<any> {
    return this.http.get(`${this.APPUrl}${this.APIUrl}/${id}`);
  }

  GetBugByLikeName(name: string): Observable<any> {
    return this.http.get(`${this.APPUrl}${this.APIUrl}/name/like/${name}`);
  }
  
  createBug(bugData: any): Observable<any> {
    console.log('metodo llamado');
    console.log(`${this.APPUrl}${this.APIUrl}/createBug`, bugData);
    return this.http.post(`${this.APPUrl}${this.APIUrl}/createBug`, bugData);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    // Verifica si el FormData contiene la palabra clave 'file'
    if (formData.has('file')) {
      // Realiza la solicitud HTTP POST solo si 'file' está presente
      return this.http.post(`${this.APPUrl}file`, formData);
    } else {
      // Realiza alguna lógica para manejar el caso en el que 'file' no esté presente
      console.error('El FormData no contiene el campo "file"');
      return throwError('Error: El FormData no contiene el campo "file"');
    }
  }

  getImageUrl(filename: string): Observable<Blob> {
    const imageUrl = `${this.APPUrl}file/${filename}`;
  
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
  
  GetBugByName(Name: string): Observable<any> {
    return this.http.get(`${this.APPUrl}${this.APIUrl}/name/${Name}`);
  }

  ChangeAnswerBug(id: number, Answer: string): Observable<any> {
    const body = {Answer}; // Crea un objeto con la propiedad Answer
    
    // Construye la URL completa con la ruta y el ID del bug
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

  ChangeBug(id: number, name: string, summary: string, description: string, state: string, priority:string, severity:string, FinishedAt: Date) : Observable<any> {
    const body = { name,summary,description,state,priority,severity,FinishedAt };
    
    // Construye la URL completa con la ruta y el ID del bug
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

  ChangedState(id: number, state: string){
    const body = {state}
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

  changedImgAnswer(id: number, imageAnswer: string ): Observable<any>{
    const body = {imageAnswer}
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.APPUrl}${this.APIUrl}/deleteBug/${id}`)
}

}
