import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Employees } from 'src/app/interfaces/employees';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class EmplooyesService {

  constructor(private http : HttpClient) { }

  getRecords(): Observable<Employees[]> {
  
    return this.http.get<Employees[]>(environment.apiUrl + "/api/Employees").pipe(
      catchError((error: any) => {
        const errorMessage = 'Failed to retrieve employee records';
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      })
    );
  }
  
  deleteRecord(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/Employees`, { body: { id } }).pipe(
      catchError((error: any) => {
        const errorMessage = 'Failed to delete employee record';
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      })
    );
  }
  
  addRecord(employee: Employees) {
    return this.http.post<Employees>(`${environment.apiUrl}/api/Employees`, employee).pipe(
      catchError((error: any) => {
        const errorMessage = 'Failed to add employee record';
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      })
    );
  }
  

  updateRecord(employee: Employees): Observable<Employees> {
    const url = `${environment.apiUrl}/api/Employees/${employee._id}`;
    return this.http.put<Employees>(url, employee).pipe(
      catchError((error: any) => {
        const errorMessage = 'Failed to update employee record';
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      })
    );
  }
  
}
