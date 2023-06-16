import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mess:string = ""
  constructor(private authService:AuthService){

  }

  loginForm = new FormGroup({
    Username: new FormControl(''),
    Password: new FormControl(''),
  });

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        // Save the token to the local storage
        if (data && data.data && data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        this.mess = ''
      },
      error: (err) => {
        console.log(err)
        this.mess = err.error.message;
      }
    });
  }
  
}