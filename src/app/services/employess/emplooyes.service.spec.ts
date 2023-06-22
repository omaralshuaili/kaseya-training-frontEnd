import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmplooyesService } from './emplooyes.service';
import { Employees } from '../../interfaces/employees';
import { environment } from 'src/environments/environment.development';

describe('EmplooyesService', () => {
  let service: EmplooyesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmplooyesService]
    });
    service = TestBed.inject(EmplooyesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle errors when retrieving employee records', () => {
    const errorMessage = 'Failed to retrieve employee records';
  
    service.getRecords().subscribe(
      () => {
        // The request should not succeed, so this should not be called
        fail('Expected an error to be thrown');
      },
      (error: any) => {
        expect(error.message).toEqual(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('network error'), { status: 500, statusText: 'Internal Server Error' });
  });
  it('should retrieve employee records from the API', () => {
    const mockEmployees: Employees[] = [
      { _id: '1', firstName: 'John', lastName: 'Doe', DOB: '1990-01-01', email: 'john.doe@example.com', skillLevel: [], active: true, age: 31 },
      { _id: '2', firstName: 'Jane', lastName: 'Smith', DOB: '1995-02-01', email: 'jane.smith@example.com', skillLevel: [], active: false, age: 26 }
    ];

    service.getRecords().subscribe((employees: Employees[]) => {
      expect(employees.length).toBe(2);
      expect(employees).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should delete an employee record from the API', () => {
    const employeeId = '1';

    service.deleteRecord(employeeId).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: employeeId });
    req.flush({});
  });

  it('should add an employee record to the API', () => {
    const newEmployee: Employees = {
      firstName: 'John',
      lastName: 'Doe',
      DOB: '1990-01-01',
      email: 'john.doe@example.com',
      skillLevel: [],
      active: true,
      age: 31
    };

    service.addRecord(newEmployee).subscribe((employee: Employees) => {
      expect(employee).toEqual(newEmployee);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEmployee);
    req.flush(newEmployee);
  });

  it('should update an employee record in the API', () => {
    const updatedEmployee: Employees = {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      DOB: '1990-01-01',
      email: 'john.doe@example.com',
      skillLevel: [],
      active: true,
      age: 31
    };

    service.updateRecord(updatedEmployee).subscribe((employee: Employees) => {
      expect(employee).toEqual(updatedEmployee);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedEmployee);
    req.flush(updatedEmployee);
  });


  
  it('should handle errors when deleting an employee record', () => {
    const employeeId = '1';
    const errorMessage = 'Failed to delete employee record';
  
    service.deleteRecord(employeeId).subscribe(
      () => {
        // The request should not succeed, so this should not be called
        fail('Expected an error to be thrown');
      },
      (error: any) => {
        expect(error.message).toEqual(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: employeeId });
    req.error(new ErrorEvent('network error'), { status: 500, statusText: 'Internal Server Error' });
  });
  
  it('should handle errors when adding an employee record', () => {
    const newEmployee: Employees = {
      firstName: 'John',
      lastName: 'Doe',
      DOB: '1990-01-01',
      email: 'john.doe@example.com',
      skillLevel: [],
      active: true,
      age: 31
    };
    const errorMessage = 'Failed to add employee record';
  
    service.addRecord(newEmployee).subscribe(
      () => {
        // The request should not succeed, so this should not be called
        fail('Expected an error to be thrown');
      },
      (error: any) => {
        expect(error.message).toEqual(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEmployee);
    req.error(new ErrorEvent('network error'), { status: 500, statusText: 'Internal Server Error' });
  });
  it('should handle errors when updating an employee record', () => {
    const updatedEmployee: Employees = {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      DOB: '1990-01-01',
      email: 'john.doe@example.com',
      skillLevel: [],
      active: true,
      age: 31
    };
    const errorMessage = 'Failed to update employee record';
  
    service.updateRecord(updatedEmployee).subscribe(
      () => {
        // The request should not succeed, so this should not be called
        fail('Expected an error to be thrown');
      },
      (error: any) => {
        expect(error.message).toContain(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/Employees/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedEmployee);
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });
  
})