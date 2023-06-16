import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService,private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get the token from auth service
    let jwtToken = this.auth.getToken();
    console.log(jwtToken)
    // check if the token exists
    if (jwtToken) {
      // clone the request and add new header with JWT token
      request = request.clone({
        setHeaders: {
          Authorization: jwtToken
        }
      });
    }
  
    // continue the request with the (potentially updated) request
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/']);
          }
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }
  
}
