import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }
  convertImageToBase64(file: File): Observable<string> {
    const reader = new FileReader();

    return new Observable<string>((observer) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        observer.next(base64String);
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
