import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { EmplooyesService } from '../services/employess/emplooyes.service';
import { loadEmployees, loadEmployeesSuccess, loadEmployeesFailure, deleteEmployee } from './employees.action';

@Injectable()
export class EmployeesEffects {

  loadEmployees$ = createEffect(() => this.actions$.pipe(
    ofType(loadEmployees),
    mergeMap(() => this.employeesService.getRecords()
      .pipe(
        map(employees => loadEmployeesSuccess({ employees })),
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
}
