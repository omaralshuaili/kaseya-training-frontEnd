import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employees } from 'src/app/interfaces/employees';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class EmplooyesService {

  constructor(private http : HttpClient) { }

  getRecords() : Observable<[Employees]>{
    return this.http.get<[Employees]>(environment.apiUrl + "/api/Employees")
  }
}
