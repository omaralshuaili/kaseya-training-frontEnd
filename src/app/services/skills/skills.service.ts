import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from 'src/app/interfaces/skills';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private http:HttpClient) { }

  getSkills() : Observable<any>{
    return this.http.get<[Skill]>(environment.apiUrl + "/api/skills")
  }
}
