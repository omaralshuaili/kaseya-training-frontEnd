import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ListingComponent } from './listing.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AppState } from '../employees-store/app.state';
import { EmplooyesService } from '../services/employess/emplooyes.service';
import { deleteEmployee } from '../employees-store/employees.action';

import { SkillsService } from '../services/skills/skills.service';
import { Skill } from '../interfaces/skills';
import { Employees } from '../interfaces/employees';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;
  class MockStore {
    dispatch = jasmine.createSpy('dispatch');
    pipe = jasmine.createSpy('pipe').and.returnValue(of(/* mock values */));
  }
  let employeesServiceMock: jasmine.SpyObj<EmplooyesService>;
  let skillServiceMock: jasmine.SpyObj<SkillsService>;

  let storeMock: MockStore;



  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
    const employeesServiceSpy = jasmine.createSpyObj('EmployeesService', [
      'getSkills',
    ]);



    await TestBed.configureTestingModule({
      declarations: [ListingComponent],
      providers: [
        FormBuilder,
        { provide: Store, useValue: storeSpy },
        { provide: EmplooyesService, useValue: employeesServiceSpy },
        DatePipe,
        FontAwesomeModule,
        { provide: Store, useClass: MockStore },
      ],
      imports: [FontAwesomeModule, ReactiveFormsModule,HttpClientTestingModule],
    }).compileComponents();

    storeMock = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;

    employeesServiceMock = TestBed.inject(
      EmplooyesService
    ) as jasmine.SpyObj<EmplooyesService>;
    skillServiceMock = TestBed.inject(
      SkillsService
    ) as jasmine.SpyObj<SkillsService>;
    const faIconLibrary = TestBed.inject(FaIconLibrary);
    faIconLibrary.addIcons(faSearch);

    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  afterEach(() => {
    storeMock.dispatch.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should dispatch Load Employees action on ngOnInit', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith({type:'[Employee] Load Employees'});
  });

  it('should validate required fields', () => {
    const firstNameControl = component.addEmployeeForm.controls['firstName'];
    const lastNameControl = component.addEmployeeForm.controls['lastName'];
    const emailControl = component.addEmployeeForm.controls['email'];
    const DOBControl = component.addEmployeeForm.controls['DOB'];
  
    firstNameControl.setValue('John');
    lastNameControl.setValue('Doe');
    emailControl.setValue('johndoe@example.com');
    DOBControl.setValue('1990-01-01');
  
    expect(component.addEmployeeForm.valid).toBeTruthy();
    firstNameControl.setValue('');
    lastNameControl.setValue('');
    emailControl.setValue('testemail');
    DOBControl.setValue('');
    component.addEmployeeForm.updateValueAndValidity();
  console.log(emailControl.errors)
    expect(component.addEmployeeForm.valid).toBeFalsy();
    expect(firstNameControl.errors?.['required']).toBeTruthy();
    expect(lastNameControl.errors?.['required']).toBeTruthy();
    expect(emailControl.errors?.['email']).toBeTruthy();
    expect(DOBControl.errors?.['required']).toBeTruthy();
  });
});
