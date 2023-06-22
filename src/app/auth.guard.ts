import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> {
    return new Promise<boolean | UrlTree>((resolve) => {
      if (this.authService.isLoggedIn()) {
        resolve(true);
      } else {
        // Redirect to login page or any other desired route
        resolve(this.router.createUrlTree(['/login']));
      }
    });
  }
}
