import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string;
  password: string;
  step: number = 1;
  registerForm : FormGroup

  constructor(private authService:AuthService,private route : Router) {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });

    this.registerForm.controls

  }
  


  register() {
    const userData = { Username: this.email, Password: this.password };
    this.authService.register(userData).subscribe({
      next:(data)=>{
        console.log(data)
      },
      complete:()=>{
        this.route.navigate(['/'])
      }
    })
  }

  increaseStep(){
    this.step = this.step + 1
  }

  decreaseStep(){
    this.step = this.step - 1
  }
}
