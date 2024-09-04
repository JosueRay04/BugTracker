import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})

export class SignComponent {
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
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

  createUser() {
    if(this.userName === '' || this.firstName === '' || this.lastName === '' || this.email === '' || this.password === '') {
      this.toastr.error('Do not leave any field unfilled!', 'Error')
    } else {
      const user: User = {
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }

      this.loading = true;

      this.userService.sign(user).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success('You have successfully registered!', 'Registered User')
          this.router.navigate(['/login'])
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false
          if(e.error.msg) {
            this.toastr.error(`User already exists: ${user.userName}. Try another name, 'Error!'`)
          } else {
            this.toastr.error(`Oops, an error occurred`, 'Error!')
          }
        }
      })
      /*
      this.userService.sign(user).subscribe(() => {
        console.log('Se creó el usuario!')
        this.toastr.success('Te has registrado con exito!', 'Usuario Registrado')
        this.router.navigate(['/login'])
      }, (event: HttpErrorResponse) => {
        console.log(event.error.msg)
        this.loading = false;
        if(event.error.msg) {
          this.toastr.error(`Ya existe el usuario: ${user.userName}. Intente con otro nombre`, 'Error!')
        } else {
          this.toastr.error(`Uups, ocurrió un error`, 'Error!')
        }
      })
      */
    }
  }
}
