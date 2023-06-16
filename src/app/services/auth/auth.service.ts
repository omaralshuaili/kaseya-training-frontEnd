import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
   

  constructor(private http: HttpClient) { }

  isLoggedIn():boolean {
    throw new Error('Method not implemented.');
  }

  login(form:any){
    return this.http.post(environment.apiUrl + "/api/Authenticate/login",form)
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }
}
