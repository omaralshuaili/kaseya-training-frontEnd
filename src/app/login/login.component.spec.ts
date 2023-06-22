import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth/auth.service'
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let loginFormMock: any;
  let routerMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthService],
      declarations: [LoginComponent]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    loginFormMock = { value: { username: 'testUser', password: 'testPassword' } };
    routerMock = TestBed.inject(Router);

    spyOn(authService, 'login').and.returnValue(of({ data: { accessToken: 'testToken' } }));
    spyOn(routerMock, 'navigate');
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call authService.login with login form value and save token to localStorage', fakeAsync(() => {
    component.loginForm.setValue(loginFormMock);

    component.login();

    tick();

    expect(authService.login).toHaveBeenCalledWith(loginFormMock);
    expect(localStorage.getItem('accessToken')).toBe('testToken');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/listings']);
    expect(component.mess).toBe('');
  }));

  it('should set error message when authService.login throws an error', fakeAsync(() => {
    const errorMessage = 'Login failed';

    spyOn(authService, 'login').and.returnValue(throwError({ error: { message: errorMessage } }));

    component.loginForm.setValue(loginFormMock);

    component.login();

    tick();

    expect(authService.login).toHaveBeenCalledWith(loginFormMock);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(component.mess).toBe(errorMessage);
  }));
});
