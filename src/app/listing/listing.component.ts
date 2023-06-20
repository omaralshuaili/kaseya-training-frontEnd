import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { EmplooyesService } from '../services/employess/emplooyes.service';
import { Employees } from '../interfaces/employees';
import {
  addEmployee,
  deleteEmployee,
  loadEmployees,
  searchEmployees,
  updateEmployee,
} from '../employees-store/employees.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '../employees-store/app.state';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillsService } from '../services/skills/skills.service';
import { Skill } from '../interfaces/skills';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  originalEmployessList: Employees[] = [];
  mess: string;
  showNewEmployeeState :Boolean=false
  employeesList: Employees[] = [];
  skillList: Skill[] = [];
  newEmployeeSkillList : Skill[]= []
  skillSearchInputFocussedState: Boolean = false;
  currentEmployee = new BehaviorSubject<Employees>(null);
  editEmployeeForm: FormGroup; 
  formattedDOB: string;
  constructor(
    private store: Store<AppState>,
    private skillService: SkillsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {}
  addEmployeeForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    DOB: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    activeStatus:new FormControl('')
  });

  ngOnInit(): void {
    this.store.dispatch(loadEmployees());
    this.store
      .pipe(select((state) => state.employees.filteredEmployees))
      .subscribe((employees) => {
        this.employeesList = employees;
      });

    this.skillService.getSkills().subscribe({
      next: (value) => {
        console.log(value.data);
        this.skillList = value.data;
      },
    });

    this.editEmployeeForm = this.formBuilder.group({
      editFirstName: ['', Validators.required],
      editLastName: ['', Validators.required],
      editEmail: ['', [Validators.required, Validators.email]],
      editDOB: ['', Validators.required],
      editActiveStatus: ['', Validators.required]
      
    });

    this.currentEmployee.subscribe(employee => {
      if (employee) {
        this.editEmployeeForm.setValue({
          editFirstName: employee.firstName,
          editLastName: employee.lastName,
          editEmail: employee.email,
          editDOB: this.datepipe.transform(employee.DOB, 'yyyy-MM-dd'),
          editActiveStatus: employee.active,
        });
      }
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

  addEmployee() {
    console.log(this.addEmployeeForm.get("DOB").value)
    let newEmployee :  Employees =  {
      firstName: this.addEmployeeForm.get("firstName").value,
      lastName:this.addEmployeeForm.get("lastName").value,
      email:this.addEmployeeForm.get("email").value,
      skillLevel: this.newEmployeeSkillList.map(skill => skill._id),
      DOB:this.addEmployeeForm.get("DOB").value,
      age: this.calculateAge(new Date(this.addEmployeeForm.get("DOB").value)),
      active: this.addEmployeeForm.get("activeStatus").value == "true" ? true:false,

      
    }
    this.store.dispatch(addEmployee({ employee: newEmployee }));
  
    console.log(newEmployee)
  }
  onSkillSearchChange(event: any) {}

  ngAfterViewInit() {
    const observer = new MutationObserver(() => {
      this.colorSkillItems();
    });

    observer.observe(this.el.nativeElement, { childList: true, subtree: true });
  }

  colorSkillItems() {
    const skillSearchItems =
      this.el.nativeElement.querySelectorAll('.skill-search-item');
    console.log(skillSearchItems);
    skillSearchItems.forEach((item) => {
      const image = item.querySelector('img');
      const skillName = image.getAttribute('name');

      this.renderer.listen(item, 'mouseover', () => {
        this.renderer.addClass(item, `hover-${skillName}`);
      });

      this.renderer.listen(item, 'mouseout', () => {
        this.renderer.removeClass(item, `hover-${skillName}`);
      });
    });
  }

  public skillSearchInputFocussed() {
    setTimeout(() => {
      this.skillSearchInputFocussedState = !this.skillSearchInputFocussedState;
    }, 200);
  }

  addSkill(skill:Skill){
    this.newEmployeeSkillList.push(skill)
  }

  calculateAge(dob: Date): number {
    let today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }
  showAddNewEmployee(){
    this.showNewEmployeeState = !this.showNewEmployeeState
  }
  onEmployeeClick(employee: Employees) {
    
    this.currentEmployee.next({
      firstName: employee.firstName,
      lastName: employee.lastName,
      active: employee.active,
      DOB: employee.DOB,
      email: employee.email,
      skillLevel: employee.skillLevel,
      age: employee.age
    });

    
}





  // Update Employee
  updateEmployee() {
    console.log(this.editEmployeeForm.valid)
    if (this.editEmployeeForm.valid) {
      const updatedEmployee: Employees = this.editEmployeeForm.value;
      // Dispatch the action to update the employee
      this.store.dispatch(updateEmployee({ employee: updatedEmployee }));
    } else {
      // Handle invalid form case
      this.showErrorMessages();
    }
  }

  showErrorMessages() {
    Object.keys(this.editEmployeeForm.controls).forEach(field => { 
      const control = this.editEmployeeForm.get(field);            
      control.markAsTouched({ onlySelf: true }); 
    });
  }


 
}
