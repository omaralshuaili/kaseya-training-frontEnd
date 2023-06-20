import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employees } from 'src/app/interfaces/employees';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class EmplooyesService {
  [x: string]: any;

  constructor(private http : HttpClient) { }

  getRecords() : Observable<[Employees]>{
    return this.http.get<[Employees]>(environment.apiUrl + "/api/Employees")
  }

  deleteRecord(id:string){id
    return this.http.delete(environment.apiUrl + "/api/Employees" , {body:
    {
      id:id
    }
    } )
  }

  addRecord(employee: Employees){
    return this.http.post<Employees>(environment.apiUrl + '/api/Employees', employee);
  }

  updateRecord(employee: Employees): Observable<Employees> {
    return this.http.put<Employees>(`${environment.apiUrl}/api/Employees${employee._id}`, employee);
  }
}
