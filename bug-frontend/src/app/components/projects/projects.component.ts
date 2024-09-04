import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/project';
import { User } from 'src/app/interfaces/user';
import { NotificationService } from 'src/app/services/notification.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { Notification } from 'src/app/interfaces/notification';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})

export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  users: any[] = [];
  loading: boolean = false;
  showProjectForm: boolean = false;
  showCollaboratorForm: boolean = false;
  showDeleteProjectForm: boolean = false;
  showDeleteCollaboratorForm: boolean = false;
  showChangeCategoryForm: boolean = false;
  showChangeRoleForm: boolean = false;
  projectForm: FormGroup;
  collaboratorForm: FormGroup;
  deleteProjectForm: FormGroup;
  deleteCollaboratorForm: FormGroup;
  changeCategoryForm: FormGroup;
  changeRoleForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 4; // 2 rows of 4 columns

  totalProjects = 0; // Número total de proyectos
  totalPages = 0; 

  constructor(private userService: UserService, private projectService: ProjectService, private fb: FormBuilder, private toastr: ToastrService, private notificationService: NotificationService) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      userName: [{ value: '' }, Validators.required],
      description: ['', Validators.required],
      expectedCompletionAt: ['', Validators.required],
      category: ['OPEN', Validators.required]
    });

    
    this.projectForm.patchValue({
      userName: localStorage.getItem('userName') || '',
    });

    this.collaboratorForm = this.fb.group({
      userSearch: ['', Validators.required],
      role: ['DEVELOPER', Validators.required],
      project: [null, Validators.required],
    });

    this.deleteProjectForm = this.fb.group({
      project: ['', Validators.required],
    });

    this.deleteCollaboratorForm = this.fb.group({
      project: ['', Validators.required],
      userSearch: ['', Validators.required],
    })

    this.changeCategoryForm = this.fb.group({
      project: ['', Validators.required],
      category: ['OPEN', Validators.required]
    })

    this.changeRoleForm = this.fb.group({
      userSearch: ['', Validators.required],
      role: ['DEVELOPER', Validators.required],
      project: ['', Validators.required],
    })
  }

  userLocalStorage: string | null = '';

  ngOnInit(): void {
    this.userLocalStorage = localStorage.getItem('userName');
  
    this.loadProjects()
    this.loadUsers() 
  }

  toogleProjectForm() {
    this.showProjectForm = !this.showProjectForm;
    this.showCollaboratorForm = false;
    this.showDeleteProjectForm = false;
    this.showDeleteCollaboratorForm = false;
    this.showChangeCategoryForm = false;
    this.showChangeRoleForm = false;
  }

  toogleCollaboratorForm() {
    this.showCollaboratorForm = !this.showCollaboratorForm;
    this.showProjectForm = false;
    this.showDeleteProjectForm = false;
    this.showDeleteCollaboratorForm = false;
    this.showChangeCategoryForm = false;
    this.showChangeRoleForm = false;
  }

  toogleDeleteProjectForm() {
    this.showDeleteProjectForm = !this.showDeleteProjectForm;
    this.showCollaboratorForm = false;
    this.showProjectForm = false;
    this.showDeleteCollaboratorForm = false;
    this.showChangeCategoryForm = false;
    this.showChangeRoleForm = false;
  }

  toogleDeleteCollaboratorForm() {
    this.showDeleteCollaboratorForm = !this.showDeleteCollaboratorForm;
    this.showCollaboratorForm = false;
    this.showProjectForm = false;
    this.showDeleteProjectForm = false;
    this.showChangeCategoryForm = false;
    this.showChangeRoleForm = false;
  }
  
  toogleChangeCategoryForm() {
    this.showChangeCategoryForm = !this.showChangeCategoryForm;
    this.showCollaboratorForm = false;
    this.showProjectForm = false;
    this.showDeleteProjectForm = false;
    this.showDeleteCollaboratorForm = false
    this.showChangeRoleForm = false;
  }

  toogleChangeRoleForm() {
    this.showChangeRoleForm = !this.showChangeRoleForm;
    this.showCollaboratorForm = false;
    this.showProjectForm = false;
    this.showDeleteProjectForm = false;
    this.showDeleteCollaboratorForm = false
    this.showChangeCategoryForm = false;
  }

  private loadProjects() {
    this.projectService.getProjectsForUserAndCollaborations().subscribe(
      (data: Project[]) => {
        this.projects = data;
        this.totalProjects = data.length;
        this.totalPages = Math.ceil(this.totalProjects / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  
  private loadUsers() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  createProject() {
    if(this.projectForm.valid) {
      const project: Project = {
        name: this.projectForm.value.name,
        userName: this.projectForm.value.userName,
        description: this.projectForm.value.description,
        expectedCompletionAt: this.projectForm.value.expectedCompletionAt,
        category: this.projectForm.value.category
      };
    
      this.loading = true;
    
      // Llama al servicio para crear el proyecto
      this.projectService.createProject(project).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success('Project created successfully', 'Project Created');
          console.log(project);
          this.loadProjects();
          this.projectForm.reset();
          this.showProjectForm = false;
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          if (e.error.msg) {
            this.toastr.error(`A project with the name: ${project.name} already exists. Try another name`, 'Error');
          } else {
            this.toastr.error(`Uups, something goes wrong!`, 'Error');
          }
        }
      });

    } else {
      this.toastr.error('Do not leave any field unfilled!', 'Error')
    }
  }

// projects.component.ts
  addCollaborator() {
    if (this.collaboratorForm.valid) {
      const collaboratorData = {
        name: this.collaboratorForm.value.project,
        collaborator: this.collaboratorForm.value.userSearch,
        role: this.collaboratorForm.value.role
      };

      // Lógica para agregar el colaborador al proyecto
      this.projectService.addCollaborator(collaboratorData).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success('Contributor successfully added', 'Added Contributor');
          this.loadProjects();
          this.collaboratorForm.reset();
          this.showCollaboratorForm = false;

          const notification: Notification = {
            sender: localStorage.getItem('userName') || '',
            recipient: collaboratorData.collaborator,
            message: `added you as a ${collaboratorData.role} in project ${collaboratorData.name}`
          };

          this.notificationService.createNotification(notification).subscribe({
            next: (v) => {}
          })
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.toastr.error('Error adding collaborator', 'Error');
        }
      });
    } else {
      this.toastr.error('Do not leave any field unfilled!', 'Error');
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    // Asegúrate de que currentPage no exceda el número total de páginas
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  deleteProject() {
    if (this.deleteProjectForm.valid) {
      const projectName = this.deleteProjectForm.value.project;

      console.log(projectName);
      this.projectService.deleteProject(projectName).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success('Project deleted successfully', 'Deleted Project');
          this.loadProjects();
          this.deleteProjectForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.toastr.error('Error deleting project', 'Error');
        }
      });
    } else {
      this.toastr.error('Do not leave any field unfilled!', 'Error');
    }
  }

  deleteCollaborator() {
    if (this.deleteCollaboratorForm.valid) {
      const deleteCollaboratorData = {
        projectName: this.deleteCollaboratorForm.value.project,
        collaboratorName: this.deleteCollaboratorForm.value.userSearch,
      };

      console.log(deleteCollaboratorData)
      this.projectService.deleteCollaboratorFromProject(deleteCollaboratorData).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success('Collaborator successfully removed', 'Removed Collaborator');
          this.loadProjects();
          this.deleteCollaboratorForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.toastr.error('Error when deleting collaborator', 'Error');
        }
      });
    } else {
      this.toastr.error('Do not leave any field unfilled!', 'Error');
    }
  }

  changeCategory() {
    if (this.changeCategoryForm.valid) {
      const changeCategoryData = {
        name: this.changeCategoryForm.value.project,
        newCategory: this.changeCategoryForm.value.category
      };

      // Lógica para agregar el colaborador al proyecto
      this.projectService.changeCategory(changeCategoryData).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(`New Category: ${changeCategoryData.newCategory}!`, 'Category Change');
          this.loadProjects();
          this.changeCategoryForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.toastr.error('Error when changing role', 'Error');
        }
      });
    } else {
      this.toastr.error('Do not leave any field unfilled!', 'Error');
    }
  }

  changeRole() {
    if (this.changeRoleForm.valid) {
      const changeRoleData = {
        projectName: this.changeRoleForm.value.project,
        collaboratorName: this.changeRoleForm.value.userSearch,
        newRole: this.changeRoleForm.value.role
      };

      // Lógica para agregar el colaborador al proyecto
      this.projectService.changeRole(changeRoleData).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(`New Role: ${changeRoleData.newRole}!`, 'Role Change');
          this.loadProjects();
          this.changeRoleForm.reset();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.toastr.error('Error when changing role', 'Error');
        }
      });
    } else {
      this.toastr.error('Do not leave any field unfilled!', 'Error');
    }
  }
  
}
