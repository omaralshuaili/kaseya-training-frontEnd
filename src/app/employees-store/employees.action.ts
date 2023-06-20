import { createAction, props } from '@ngrx/store';
import { Employees } from '../interfaces/employees';

export const loadEmployees = createAction('[Employee] Load Employees');
export const loadEmployeesSuccess = createAction('[Employee] Load Employees Success', props<{ employees: Employees[] }>());
export const loadEmployeesFailure = createAction('[Employee] Load Employees Failure', props<{ error: any }>());
export const deleteEmployee = createAction('[Employee] Delete Employee', props<{ id: string }>());
export const searchEmployees = createAction('[Employee] Search Employees', props<{ searchText: string }>());
export const addEmployee = createAction('[Employee] Add Employee', props<{ employee: Employees }>());
