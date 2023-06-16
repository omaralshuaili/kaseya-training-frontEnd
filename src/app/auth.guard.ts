import { CanActivateFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot,UrlMatchResult } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';
export function authGuard(): CanActivateFn {
  return () => {
    const _authService: AuthService = inject(AuthService);
    
    if (_authService.isLoggedIn()) {
      return true;
    }
    return false;
  };
};
