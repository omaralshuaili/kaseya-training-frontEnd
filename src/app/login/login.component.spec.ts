import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set error message on failed login', fakeAsync(() => {
    const errorMessage = 'Login failed';
    authService.login.and.returnValue(throwError({ error: { message: errorMessage } }));
  
    component.loginForm.setValue({
      Username: 'test@example.com',
      Password: 'password'
    });
    component.login();
  
    tick();
  
    expect(authService.login).toHaveBeenCalledWith({
      Username: 'test@example.com',
      Password: 'password'
    });
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.mess).toBe(errorMessage);
  }));
  


  it('should navigate to "/listings" on successful login', fakeAsync(() => {
    const accessToken = 'fakeAccessToken';
    authService.login.and.returnValue(of({ data: { accessToken } }));

    component.loginForm.setValue({
      Username: 'test@example.com',
      Password: 'password'
    });
    component.login();

    tick();

    expect(authService.login).toHaveBeenCalledWith({
      Username: 'test@example.com',
      Password: 'password'
    });
    expect(localStorage.getItem('accessToken')).toBe(accessToken);
    expect(router.navigate).toHaveBeenCalledWith(['/listings']);
    expect(component.mess).toBe('');
  }));


  
});
