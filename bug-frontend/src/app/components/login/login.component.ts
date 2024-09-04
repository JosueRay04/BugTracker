import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = '';
  password: string = '';

  loading: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private toastr: ToastrService, 
    private userService: UserService,
    private router: Router
  ) { }

  @ViewChild('passwordField')
  passwordField!: ElementRef;
  
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.passwordField.nativeElement.type = this.passwordVisible ? 'text' : 'password';    
  }
  
  @Output() isLoggedInChange = new EventEmitter<boolean>();

  login() {
    if (this.userName === '' || this.password === '') {
      this.toastr.error('Do not leave any field unfilled!', 'Error');
    } else {
      const user: User = {
        userName: this.userName,
        password: this.password
      };
  
      this.loading = true;
  
      this.userService.login(user).subscribe({
        next: (token) => {
          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem('userName', this.userName); // Almacena el nombre de usuario en localStorage
  
          this.isLoggedInChange.emit(true);
  
          // Modificar la navegación para omitir el nombre de usuario en la URL
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          if (e.status === 404) {
            this.toastr.error(`Invalid credentials`, 'Error!');
          } else {
            this.toastr.error(`Oops, an error occurred`, 'Error!');
          }
        }
      });
    }
  }
  
}




