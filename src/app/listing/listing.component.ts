import { Component, OnInit } from '@angular/core';
import { EmplooyesService } from '../services/employess/emplooyes.service';
import { Employees } from '../interfaces/employees';
import {
  deleteEmployee,
  loadEmployees,
  searchEmployees,
} from '../employees-store/employees.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '../employees-store/app.state';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  originalEmployessList: Employees[] = [];
  mess: string;

  employeesList: Employees[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployees());
    this.store
      .pipe(select((state) => state.employees.filteredEmployees))
      .subscribe((employees) => {
        this.employeesList = employees;
      });
  }

  delete(id: string) {
    this.store.dispatch(deleteEmployee({ id }));
  }

  onSearchChange(event: any): void {
    const searchText = event.target.value;
    this.store.dispatch(searchEmployees({ searchText }));
  }
  showMenu(item: Employees) {
    item.show = !item.show;
  }
}
