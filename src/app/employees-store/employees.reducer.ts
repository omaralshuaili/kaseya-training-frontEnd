// employees.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { Employees } from '../interfaces/employees';
import { loadEmployees, loadEmployeesSuccess, loadEmployeesFailure, deleteEmployee, searchEmployees, addEmployee } from './employees.action';

export const employeesFeatureKey = 'employees';

export interface EmployeesState {
  employees: Employees[];
  filteredEmployees: Employees[];  
  error: any;
  searchText: string;
}

export const initialEmployeesState: EmployeesState = {
  employees: [],
  filteredEmployees: [], // Initialise it as empty array
  error: null,
  searchText: '' // Initialise it as empty string
};

export const employeesReducer = createReducer(
  initialEmployeesState,
  on(loadEmployees, state => state),
  on(loadEmployeesSuccess, (state, action) => ({...state, employees: action.employees, filteredEmployees: action.employees})), // Update the filteredEmployees as well
  on(loadEmployeesFailure, (state, action) => ({...state, error: action.error})),
  on(deleteEmployee, (state, action) => ({
    ...state,
    employees: state.employees.filter(employee => employee._id !== action.id),
    filteredEmployees: state.filteredEmployees.filter(employee => employee._id !== action.id) // Update the filteredEmployees as well
  })),
  on(searchEmployees, (state, action) => {
    const searchText = action.searchText.toLocaleLowerCase();
    return {
      ...state,
      searchText: action.searchText,
      filteredEmployees: state.employees.filter(employee =>
        (employee.firstName.toLocaleLowerCase() + " " + employee.lastName.toLocaleLowerCase()).includes(searchText)
      )
    }
  }),
  on(addEmployee, (state, action) => ({
    ...state,
    employees: [...state.employees, action.employee],
    filteredEmployees: [...state.employees, action.employee]
  })),
);

export function reducer(state: EmployeesState | undefined, action: Action) {
  return employeesReducer(state, action);
}
