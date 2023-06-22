import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

describe('AuthGuard', () => {
  let executeGuard: () => AuthGuard;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    executeGuard = () => TestBed.runInInjectionContext(() => new AuthGuard(TestBed.inject(Router), TestBed.inject(AuthService)));
  });

  it('should be created', () => {
    const guard = executeGuard();
    expect(guard).toBeTruthy();
  });
});
