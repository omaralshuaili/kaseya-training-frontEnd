import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('isLoggedIn should return true if access token exists', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue('dummyAccessToken');

    // Act
    const isLoggedIn = authService.isLoggedIn();

    // Assert
    expect(isLoggedIn).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith('accessToken');
  });

  it('isLoggedIn should return false if access token does not exist', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Act
    const isLoggedIn = authService.isLoggedIn();

    // Assert
    expect(isLoggedIn).toBe(false);
    expect(localStorage.getItem).toHaveBeenCalledWith('accessToken');
  });

  it('login should make a POST request to the login endpoint', () => {
    // Arrange
    const form = { username: 'testuser', password: 'testpass' };
    const mockResponse = { token: 'dummyToken' };

    // Act
    authService.login(form).subscribe(response => {
      // Assert
      expect(response).toEqual(mockResponse);
    });

    // Assert
    const req = httpTestingController.expectOne(environment.apiUrl + '/api/Authenticate/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(form);

    // Respond with mock data
    req.flush(mockResponse);
  });

  it('refreshToken should make a POST request to the refresh token endpoint', () => {
    // Arrange
    const mockResponse = { newToken: 'dummyNewToken' };

    // Act
    authService.refreshToken().subscribe(response => {
      // Assert
      expect(response).toEqual(mockResponse);
    });

    // Assert
    const req = httpTestingController.expectOne(environment.apiUrl + '/api/Authenticate/refresh-token');
    expect(req.request.method).toBe('POST');

    // Respond with mock data
    req.flush(mockResponse);
  });
  it('setToken should store the access token in local storage', () => {
    // Arrange
    const accessToken = 'dummyAccessToken';
    spyOn(localStorage, 'setItem');
  
    // Act
    authService.setToken(accessToken);
  
    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', accessToken);
  });
  

  it('getAccessToken should retrieve the access token from local storage', () => {
    // Arrange
    const accessToken = 'dummyAccessToken';
    spyOn(localStorage, 'getItem').and.returnValue(accessToken);
  
    // Act
    const result = authService.getAccessToken();
  
    // Assert
    expect(result).toBe(accessToken);
    expect(localStorage.getItem).toHaveBeenCalledWith('accessToken');
  });
  

  it('clearTokens should remove the access token from local storage', () => {
    // Arrange
    spyOn(localStorage, 'removeItem');
  
    // Act
    authService.clearTokens();
  
    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  });
  
});
