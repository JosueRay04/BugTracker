import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BugService } from 'src/app/services/bug.service';
import { FormsModule,FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-bugdetail',
  templateUrl: './bugdetail.component.html',
  styleUrl: './bugdetail.component.css'
})
export class BugdetailComponent implements OnInit {
  bugs: any = {}; // Propiedad para almacenar la información del bug
  respuesta: string = '';
  name: string = "";
  summary: string = "";
  description: string = "";
  state: string = "";
  priority: string = "";
  severity: string = "";
  finishedAt: Date = new Date();
  BugAutor: string | undefined;
  bugCollaborator: string | undefined;
  imageUrl: SafeUrl | null = null;
  imageUrlAnswer: SafeUrl | null = null;
  isImageExpanded = false;
  idBug : number = 0;
  imageAnswer: string = '';

  constructor(private sanitizer: DomSanitizer, private toastr: ToastrService,private route: ActivatedRoute, private router: Router, private bugService: BugService) {}

  ngOnInit(): void {
    // Suscríbete a los cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      // Verifica si 'bugName' está presente en los parámetros
      if (params['bugName']) {
        const bugName = params['bugName'];
        console.log('Bug Name from route parameters:', bugName);
        console.log(bugName)
        // Llama a la función para cargar los bugs
        this.loadBugs(bugName);
      }
    });
  }

  loadBugs(bugName: string): void {
    // Llama al servicio para obtener los bugs por nombre
    this.bugService.GetBugByName(bugName).subscribe(
      (response) => {
        console.log(response);
        this.idBug =  response.idBug;
        this.BugAutor = response.userName;
        this.bugCollaborator = response.collaborators[0];
        this.imageAnswer = response.imageAnswer;
        
        this.imageUrl = response.image;
        this.imageUrlAnswer = response.imageAnswer;

        if (this.imageUrl) {
          // Solo si imageUrl no es nulo
          this.bugService.getImageUrl(this.imageUrl.toString()).subscribe((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            // Convierte la URL en un SafeUrl
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
            // Ahora puedes usar this.imageUrl donde se espera un SafeUrl
          });
        }

        if (this.imageUrlAnswer) {
          // Solo si imageUrl no es nulo
          this.bugService.getImageUrl(this.imageUrlAnswer.toString()).subscribe((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            // Convierte la URL en un SafeUrl
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
            // Ahora puedes usar this.imageUrl donde se espera un SafeUrl
          });
        }
        
        // Manejar la respuesta aquí, por ejemplo, asignarla a la propiedad bugs
        this.bugs = response;
      },
      (error) => {
        // Manejar el error aquí
        console.error('Error fetching bugs:', error);
      }
    );
  }


  submitFormChangeAll(id: number){
    console.log(this.name);
    console.log(this.description);
    console.log(this.summary);
    console.log(this.state);
    console.log(this.priority);
    console.log(this.severity);
    console.log(this.finishedAt);
  }


  submitFormChangeBug(id: number) {
    // Obtener el valor de 'userName' desde el localStorage
    const localStorageUserName = localStorage.getItem('userName');
  
    // Comparar 'localStorageUserName' con 'bugAutor'
    if (localStorageUserName === this.BugAutor) {
      // Si son iguales, llamar al servicio
      this.bugService.ChangedState(id, this.state).subscribe(
        Response => {
          this.toastr.success('State Changed Successfully');
        },
        error => {
          this.toastr.error('Error');
        }
      );
    } else {
      // Si no son iguales, mostrar un mensaje de error
      this.toastr.error('You do not have permissions to change bug');
    }
  } 
  

  submitForm(id: number) {
    // Obtener el valor de 'userName' desde el localStorage
    const localStorageUserName = localStorage.getItem('userName');
    console.log(this.bugCollaborator);
    // Comparar 'localStorageUserName' con 'bugCollaborator'
    if (localStorageUserName === this.bugCollaborator) {
      // Si son iguales, llamar al servicio
      this.bugService.ChangeAnswerBug(id, this.respuesta).subscribe(
        response => {
          this.toastr.success('Answer changed successfully');
          // Realiza cualquier acción adicional después de la actualización exitosa
        },
        error => {
          this.toastr.error('Error');
          // Maneja el error de acuerdo a tus necesidades
        }
      );
      this.bugService.changedImgAnswer(id, this.imageAnswer).subscribe(
        Response => {
          this.toastr.success('Image changed Successfully');
        },
        error => {
          this.toastr.error('Error');
        }
      );
    } else {
      // Si no son iguales, mostrar un mensaje de error
      this.toastr.error('This bug is not assigned to you');
    }
  }
  
  deleteBug(notificationId: number) { // Cambia el tipo de dato de 'string' a 'number'
    const localStorageUserName = localStorage.getItem('userName');
  
    // Comparar 'localStorageUserName' con 'bugAutor'
    if (localStorageUserName === this.BugAutor) {
      // Si son iguales, llamar al servicio
      this.bugService.deleteNotification(notificationId).subscribe(
        (response) => {
          // Actualizar la lista de notificaciones después de eliminar
            this.toastr.success('Bug was deleted!', 'Deleted bug')
            this.router.navigate(['/bugs'])
            },
        (error) => {
          console.error('Error deleting notification:', error);
        }
      );
    } else {
      // Si no son iguales, mostrar un mensaje de error
      this.toastr.error('You do not have permissions to delete bug');
    }
  }
  toggleImageSize(): void {
    this.isImageExpanded = !this.isImageExpanded;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log(this.imageAnswer);
    if (file) {
      this.bugService.uploadFile(file).subscribe(
        response => {
          console.log(response.msg);
        },
        error => {
          console.error('Error al subir el archivo:', error);
        }
      );
    }
  }

}
