import { Component, OnInit } from '@angular/core';
import { EmplooyesService } from '../services/employess/emplooyes.service';
import { Employees } from '../interfaces/employees';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  EmployessList : [Employees] 
  constructor(private employeesService:EmplooyesService){}
  ngOnInit(): void {
    this.employeesService.getRecords().subscribe({
      next:(data)=>{
        this.EmployessList = data
      }
    })
  }
}
