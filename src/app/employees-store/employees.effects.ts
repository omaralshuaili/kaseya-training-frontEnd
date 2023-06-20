import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { EmplooyesService } from '../services/employess/emplooyes.service';
import { loadEmployees, loadEmployeesSuccess, loadEmployeesFailure, deleteEmployee, addEmployee } from './employees.action';

@Injectable()
export class EmployeesEffects {

    loadEmployees$ = createEffect(() => this.actions$.pipe(
        ofType(loadEmployees),
        mergeMap(() => this.employeesService.getRecords()
          .pipe(
            map(employees => {
                const updatedEmployees = employees.map(emp => ({...emp, show: false})); // Add show property to each employee
                return loadEmployeesSuccess({ employees: updatedEmployees });
            }),
            catchError(() => EMPTY)
          ))
        )
    );
    
    

  deleteEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(deleteEmployee),
    mergeMap(action => this.employeesService.deleteRecord(action.id).pipe(
      map(() => loadEmployees()),
      catchError(() => EMPTY)
    ))
  ));

  constructor(
    private actions$: Actions,
    private employeesService: EmplooyesService
  ) {}

  addEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(addEmployee),
    switchMap(action =>
      this.employeesService.addRecord(action.employee).pipe(
        map(() => loadEmployees()),
        catchError(() => EMPTY)
      )
    )
  ));
}
