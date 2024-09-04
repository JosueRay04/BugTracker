import { Component, OnInit } from '@angular/core';
import { BugService } from 'src/app/services/bug.service';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { Notification } from 'src/app/interfaces/notification';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.css']
})

export class BugsComponent implements OnInit {
  bugs: any[] = [];
  projects: any[] = [];
  allProjects: any[] = [];
  showBugForm: boolean = false;
  bugForm: FormGroup;
  public archivos: any[] = [];
  isRowHovered: boolean = false;
  clickedRow: number | null = null;
  buttonColor: string = '#FF0000';
  opcionesProyecto: any[] = [];
  pageSize = 10;     // Tamaño de la página
  currentPage = 1;   // Página actual

  constructor(fileService: FileService, private router: Router, private toastr: ToastrService, private route: Router, private bugService: BugService, private notificationService: NotificationService, private projectService: ProjectService, private fb: FormBuilder,private http: HttpClient) {
    this.archivos = [];
    this.bugForm = this.fb.group({
      name: ['', Validators.required],
      summary: ['', Validators.required],
      description: ['', Validators.required],
      selectedOptionState: ['', Validators.required],
      selectedOptionPriority: ['', Validators.required],
      selectedOptionSeverity: ['', Validators.required],
      expectedCompletionAt: ['', Validators.required],
      selectedOptionProjectName: ['', Validators.required],
      selectedOptionColaborations: [''],
      image: [null]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

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

  navigateToBugDetails(bugName: string) {
    this.route.navigate(['bugdetail', bugName]);
  }
  
  loadBugsByProperty(property: string, filterValue: string, isEqualityCheck: boolean = false) {
    this.bugService.getBugs().subscribe(
      (data) => {
        this.bugs = data;
        const today = new Date();
        this.bugs = this.bugs
          .filter(bug => {
            if (isEqualityCheck) {
              return bug[property] === filterValue && this.isBugVisible(bug);
            } else {
              // Realiza la comparación de cadena ignorando mayúsculas y minúsculas
              return bug[property].toLowerCase() === filterValue.toLowerCase() && this.isBugVisible(bug);
            }
          })
          .sort((a, b) => this.compareDates(b.createdAt, a.createdAt, today));
        // Aquí puedes acceder a la información del usuario para cada bug
        this.bugs.forEach(bug => {
          console.log(bug);
        });
      },
      (error) => {
        console.error('Error fetching bugs:', error);
      }
    );
  }
  
  loadBugBySeverity(newState: string) {
    this.loadBugsByProperty('severity', newState);
  }
  
  loadBugByPriority(newState: string) {
    this.loadBugsByProperty('priority', newState);
  }
  

  loadBugByState(newState: string) {
    // Usa el tercer parámetro para indicar que la comparación debe ser exacta
    this.loadBugsByProperty('state', newState, true);
    }

  ngOnInit(): void {
    
    this.loadBugs();
    
    this.loadProjects();

    this.loadProjectsUserAndCollaborators();    

  }

  loadBugByProyecto(opcion: string) {
    this.loadBugsByProperty('ProjectName', opcion);
  }

  cargarOpcionesProyecto() {
    this.projectService.getProjectsForUserAndCollaborations().subscribe(
      (response) => {
        const userNameLocalStorage = localStorage.getItem('userName');
  
        // Filtra los proyectos según las condiciones especificadas
        this.opcionesProyecto = response.filter((proyecto: any) => {
          return (
            proyecto.userName === userNameLocalStorage ||
            (proyecto.collaborators && proyecto.collaborators.some((collaborator: any) => collaborator.collaborator === userNameLocalStorage))
          );
        });
      },
      (error) => {
        console.error('Error al obtener opciones de proyecto:', error);
      }
    );
  }
  
  


  onProjectSelectChange() {
    
    const selectedProjectName = this.bugForm.get('selectedOptionProjectName')?.value;
    const selectedProject = this.projects.find(project => project.name === selectedProjectName);
  
    if (selectedProject) {
      console.log('Selected Project:', selectedProject);
    } else {
      console.log('Project not found');
    }
  
    // Reinicia la lista de colaboradores siempre asignando un array vacío
    this.bugForm.get('selectedOptionColaborations')?.setValue([]);
  
    // Asigna la lista de colaboradores al formulario si el proyecto está seleccionado
    if (selectedProject && selectedProject.collaborators && selectedProject.collaborators.length > 0) {
      const collaboratorsNames = selectedProject.collaborators.map((collaborator: { collaborator: any; }) => collaborator.collaborator);
      const collaboratorsString = collaboratorsNames.join(', ');
  
      console.log('Collaborators:', collaboratorsString);
  
      this.bugForm.get('selectedOptionColaborations')?.setValue([...collaboratorsNames]);
    }
  }

  SearchButtonClick(bugname: string): void {
      this.bugs = [];
    
      this.bugService.GetBugByLikeName(bugname).subscribe(
        (response) => {
          console.log(response);
    
          // Verificar si la respuesta es un array
          if (Array.isArray(response)) {
            // La respuesta ya es un array, filtrar resultados que contengan la palabra ingresada
            this.bugs = response.filter((bug) => this.includesIgnoreCase(bug.name, bugname));
          } else if (typeof response === 'object' && response !== null) {
            // La respuesta es un objeto, convertirlo en un array
            this.bugs = [response];
          } else {
            console.error('La respuesta no es un array ni un objeto válido:', response);
          }
        },
        (error) => {
          // Manejar el error aquí
          console.error('Error fetching bugs:', error);
        }
      );
    }

  includesIgnoreCase(source: string, search: string): boolean {
    return source.toLowerCase().includes(search.toLowerCase());
  }
  

  loadProjectsUserAndCollaborators() {
    this.projectService.getProjectsForUserAndCollaborations().subscribe(
      (data) => {
        this.allProjects = data;
        console.log(data);
  
        // Filtra los proyectos que cumplen las condiciones
        this.projects = this.allProjects.filter(project => {
          const localUserName = localStorage.getItem('userName');
          
          // Verifica si el usuario local es un colaborador con el rol de "ADMINISTRATOR"
          const isAdminCollaborator = project.collaborators?.some((collaborator: { collaborator: string | null; role: string; }) =>
            collaborator.collaborator === localUserName && collaborator.role === 'ADMINISTRATOR'
          );
  
          // Verifica si el usuario local es el creador del proyecto
          const isProjectOwner = project.userName === localUserName;
  
          // Devuelve true si cumple alguna de las dos condiciones
          return isAdminCollaborator || isProjectOwner;
        });
  
        // Puedes eliminar este console.log si no lo necesitas
        this.projects.forEach(project => {
          console.log(project);
        });
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Puedes manejar el error de la manera que consideres adecuada
      }
    );
  }
  
  

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.projects = data;
        console.log(data);

        this.projects.forEach(project => {
          console.log(project);
        });
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Puedes manejar el error de la manera que consideres adecuada
      },
      () => {
        console.log('Projects loaded successfully');
        // Puedes realizar acciones adicionales después de que se complete la solicitud
      }
    );
  }

  collaboratorsAvailable(): boolean {
    const collaborators = this.bugForm.get('selectedOptionColaborations')?.value;
    return collaborators && collaborators.length > 0;
}

  onFileChange(event: any) {
    const filesubido = event.target.files[0];
    this.archivos.push(filesubido);
    // Aquí puedes realizar las acciones necesarias con el archivo, por ejemplo, mostrar su nombre
    console.log('Selected File:', filesubido ? filesubido.name : 'No file selected');
  }
  

  loadBugs() {
    this.bugService.getBugs().subscribe(
      (data) => {
        this.bugs = data;
        const today = new Date();
        this.bugs = this.bugs
        .filter(bug => this.isBugVisible(bug))
        .sort((a, b) => this.compareDates(b.createdAt, a.createdAt, today));
        // Aquí puedes acceder a la información del usuario para cada bug
        this.bugs.forEach(bug => {
          console.log(bug);
        });
      },
      (error) => {
        console.error('Error fetching bugs:', error);
      }
    );
  }

  compareDates(dateA: string, dateB: string, today: Date): number {
    const dateObjA = new Date(dateA);
    const dateObjB = new Date(dateB);
  
    // Compara las fechas con la fecha actual
    const diffA = Math.abs(today.getTime() - dateObjA.getTime());
    const diffB = Math.abs(today.getTime() - dateObjB.getTime());
  
    return diffB - diffA; // Ordena de forma descendente por diferencia de tiempo
  }

  isBugVisible(bug: any): boolean {
    const userName = localStorage.getItem('userName');
  
    // Verifica si el userName está en la lista de colaboradores del bug
    const isCollaborator = bug.collaborators?.some((collaborator: string) => collaborator === userName);

    const isAuthor = bug.userName === userName;

    return isCollaborator || isAuthor;
  }

  openBugForm() {
    this.showBugForm = true;
  }

  closeBugForm() {
    this.showBugForm = false;
  }

  submitBugForm() {

    const userName = localStorage.getItem('userName');
    const fileName = this.bugForm.get('image')?.value;
    const pureFileName = fileName.split('\\').pop();
    console.log(pureFileName);
    const bugData = {
      name: this.bugForm.get('name')?.value,
      summary: this.bugForm.get('summary')?.value,
      description: this.bugForm.get('description')?.value,
      state: this.bugForm.get('selectedOptionState')?.value,
      priority: this.bugForm.get('selectedOptionPriority')?.value,
      severity: this.bugForm.get('selectedOptionSeverity')?.value,
      finishedAt: this.bugForm.get('expectedCompletionAt')?.value,
      ProjectName: this.bugForm.get('selectedOptionProjectName')?.value,
      collaborators: this.bugForm.get('selectedOptionColaborations')?.value,
      image: pureFileName,  // Agregar directamente el archivo al objeto
      userName: userName,
    };
    // Agrega el archivo directamente al FormData
  
    
    this.bugService.createBug(bugData).subscribe(
      response => {
        // Maneja la respuesta de la API
        console.log(response);
        this.bugs.push(response);
        this.closeBugForm();
        this.router.navigate(['/bugs']);
        this.toastr.success('Bug created successfully', 'Bug created');

        const notification: Notification = {
          sender: localStorage.getItem('userName') || '',
          recipient: bugData.collaborators,
          message: `assigned you the "${bugData.name}" bug of the "${bugData.ProjectName}" project`
        };

        this.notificationService.createNotification(notification).subscribe({
          next: (v) => {}
        })
      },
      error => {
        // Maneja los errores si es necesario
        console.error(error);
      }
    );
  }
  
  

  //Paginar bugs//
  
  get totalPages(): number {
    return Math.ceil(this.bugs.length / this.pageSize);
  }

  get pagedBugs(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.bugs.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  //Colores
  getColorStyleForSeverity(severity: string): { color: string, background: string, borderRadius: string, textAlign: string } {
    let color: string;
    let background: string;
    let borderRadius: string;
    let textAlign: string;
  
    switch (severity) {
      case 'LOW':
        color = 'green';
        background = 'lightgreen';
        borderRadius = '20px'; // Puedes ajustar el valor según tus preferencias
        textAlign = 'center';
        break;
      case 'MEDIUM':
        color = 'orange';
        background = 'lightyellow';
        borderRadius = '20px'; // Puedes ajustar el valor según tus preferencias
        textAlign = 'center';
        break;
      case 'HIGH':
        color = 'red';
        background = 'lightcoral';
        borderRadius = '20px'; // Puedes ajustar el valor según tus preferencias
        textAlign = 'center';
        break;
      default:
        color = 'black';
        background = 'white';
        borderRadius = '0px'; // Valor predeterminado sin radio de borde
        textAlign = 'center';
        break;
    }
  
    return { color, background, borderRadius, textAlign };
  }
}