import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  verify(email, token) {
    return this.http.post(environment.apiUrl + '/api/Authenticate/verify', {
      email: email,
      token: token,
    })
  }

  constructor(private http: HttpClient) {}
  private accessTokenKey = 'accessToken';

  isLoggedIn(): boolean {
    if (this.getAccessToken()) {
      return true;
    }
    return false;
  }

  login(form: any) {
    return this.http
      .post(environment.apiUrl + '/api/Authenticate/login', form)
      .pipe(
        catchError((error: any) => {
          console.log(error);
          throw error; // Rethrow the error to be caught by the subscriber
        })
      );
  }

  logout() {
    this.clearTokens();
    return this.http
      .post(
        environment.apiUrl + '/api/Authenticate/logout',
        {},
        { withCredentials: true }
      )
      .pipe(
        catchError((error: any) => {
          console.log(error);
          throw error; // Rethrow the error to be caught by the subscriber
        })
      );
  }

  register(form: any) {
    return this.http
      .post(environment.apiUrl + '/api/Authenticate/register', form)
      .pipe(
        catchError((error: any) => {
          console.log(error);
          throw error; // Rethrow the error to be caught by the subscriber
        })
      );
  }
  refreshToken(): Observable<any> {
    // Make an HTTP request to your server's refresh token endpoint
    return this.http.post(
      environment.apiUrl + '/api/Authenticate/refresh-token',
      {},
      { withCredentials: true }
    );
  }

  setToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  getAccessToken(): string {
    return localStorage.getItem(this.accessTokenKey);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
  }
}
