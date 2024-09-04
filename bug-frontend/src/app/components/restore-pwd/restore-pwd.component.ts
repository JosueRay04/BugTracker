import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-restore-pwd',
  templateUrl: './restore-pwd.component.html',
  styleUrls: ['./restore-pwd.component.css']
})
export class RestorePwdComponent {
  token: string = ''
  password: string = ''

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

  restorePwd() {
    if(this.token === '' || this.password === '') {
      this.toastr.error('Do not leave any field unfilled!', 'Error')
    } else {
      const user: User = {
        passwordToken: this.token,
        password : this.password
      }

      this.loading = true;

      this.userService.restorePwd(user).subscribe({
        next: (v) => {
          this.loading = false
          this.toastr.success(`Your password has been reset`, 'Password changed')
          this.router.navigate(['/login'])
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false
          if(e.status === 404) {
            this.toastr.error(`There is no user with the associated token ${user.passwordToken}`, 'Error!')
          } else {
            this.toastr.error(`Oops, an error occurred`, 'Error!')
          }
        }
      })
    }
  }
}
