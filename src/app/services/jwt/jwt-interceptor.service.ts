import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get the token from auth service
    let jwtToken = this.auth.getAccessToken();
    console.log(jwtToken);
    // check if the token exists
    if (jwtToken) {
      // clone the request and add new header with JWT token
      request = request.clone({
        setHeaders: {
          Authorization: jwtToken
        },
        withCredentials:true
      });
    }

    // continue the request with the (potentially updated) request
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {}),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // Access token expired, try to refresh the token
            return this.auth.refreshToken().pipe(
              switchMap((refreshResponse: any) => {
                console.log(refreshResponse)
                // If token refresh is successful, update the token and retry the original request
                this.auth.setToken(refreshResponse.data.accessToken);
                request = request.clone({
                  setHeaders: {
                    Authorization: refreshResponse.accessToken
                  },
                  withCredentials:true
                });
                return next.handle(request);
              }),
              catchError((refreshError: any) => {
                // Token refresh failed, redirect to login page
                this.router.navigate(['/']);
                return throwError(refreshError);
              })
            );
          } else {
            // For non-401 errors, redirect the user and throw the error
            this.router.navigate(['/']);
            return throwError(err);
          }
        }
        return throwError(err);
      })
      
    );
  }
}
