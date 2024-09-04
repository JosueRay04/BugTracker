import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-request-pwd',
  templateUrl: './request-pwd.component.html',
  styleUrls: ['./request-pwd.component.css']
})
export class RequestPwdComponent {
  email: string = ''
  
  loading: boolean = false;

  constructor(
    private toastr: ToastrService, 
    private userService: UserService,
    private router: Router
  ) { }

  requestPwd() {
    if(this.email === '') {
      this.toastr.error('Do not leave any field unfilled!', 'Error')
    } else {
      const user: User = {
        email: this.email
      }

      this.loading = true

      this.userService.requestPwd(user).subscribe({
        next: (v) => {
          this.loading = false
          this.toastr.success(`A token has been sent to ${user.email}`, 'Token sent')
          this.router.navigate(['/restorePwd'])
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false
          if(e.status === 404) {
            this.toastr.error(`There is no user with the associated email ${user.email}`, 'Error!')
          } else {
            this.toastr.error(`Oops, an error occurred`, 'Error!')
          }
        }
      })
    }
  }
}
