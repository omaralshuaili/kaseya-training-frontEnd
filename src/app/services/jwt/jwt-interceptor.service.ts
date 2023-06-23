import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap, retryWhen, delay, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly maxRetryAttempts = 3;
  private retryCount = 0;

  constructor(public auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get the token from auth service
    let jwtToken = this.auth.getAccessToken();

    // check if the token exists
    if (jwtToken) {
      // clone the request and add new header with JWT token
      request = request.clone({
        setHeaders: {
          Authorization: jwtToken
        },
        withCredentials: true
      });
    }

    // continue the request with the (potentially updated) request
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {}),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 && this.retryCount < this.maxRetryAttempts) {
            // Access token expired, try to refresh the token
            this.retryCount++;

            return this.auth.refreshToken().pipe(
              switchMap((refreshResponse: any) => {
                // If token refresh is successful, update the token and retry the original request
                this.auth.setToken(refreshResponse.data.accessToken);
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: refreshResponse.data.accessToken
                  },
                  withCredentials: true
                });
                return next.handle(newRequest);
              }),
              catchError((refreshError: any) => {
                // Token refresh failed, handle the error
                if (refreshError.status === 401) {
                  // If token refresh also returns 401, redirect to login page and log out the user
                  this.router.navigate(['/']);
                }
                return throwError(refreshError);
              })
            ).pipe(
              retryWhen(errors => errors.pipe(
                take(this.maxRetryAttempts) // Maximum number of retry attempts
              ))
            );
          } else {
            // For non-401 errors or exceeded retry attempts, throw the error
            return throwError(err);
          }
        }
        return throwError(err);
      })
    );
  }
}
