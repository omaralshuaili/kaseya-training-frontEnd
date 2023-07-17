import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading: Boolean = false;
  mess: string = '';
  verify_mess: string = '';
  constructor(
    private authService: AuthService,
    private route: Router,
    private Activeroute: ActivatedRoute
  ) {}

  ngOnInit() {
    const isVerifyPage = this.route.url.includes('verify');
    if (isVerifyPage) {
      console.log('Is verify page');
      this.Activeroute.queryParams.subscribe((params) => {
        console.log('Query params:', params);
        const token = params['token'];
        const email = params['verify'];
        this.authService.verify(email, token).subscribe({
          next: (res:any) => {
            this.verify_mess = res.message;
          },
          error: (err: any) => {
            console.log('Verification error:', err);
            this.mess = err.error.message;
          },
          complete: () => {
            console.log('Verification complete');
            this.loginForm.controls['Username'].setValue(email)
          }
        });
        
      });
    }
  }
  

  loginForm = new FormGroup({
    Username: new FormControl('', [Validators.email, Validators.required]),
    Password: new FormControl('', [Validators.min(6), Validators.required]),
  });

  login() {
    this.mess = '';
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        // Save the token to the local storage
        if (data && data.data && data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);

          this.route.navigate(['/listings']);
        }
        this.mess = '';
      },
      error: (err) => {
        console.log(err);
        this.mess = err.error.message;
      },
    });
    this.loading = false;
  }
}
