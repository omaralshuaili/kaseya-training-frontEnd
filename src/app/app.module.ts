import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ListingComponent } from './listing/listing.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { faExclamation, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './services/jwt/jwt-interceptor.service';
import {faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { employeesFeatureKey, reducer as employeesReducer } from './employees-store/employees.reducer';
import { EmployeesEffects } from './employees-store/employees.effects';
import { AppState } from './employees-store/app.state';
import { DatePipe } from '@angular/common';
import { CustomDatePipe } from './custom-date.pipe';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListingComponent,
    CustomDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot<AppState>({ [employeesFeatureKey]: employeesReducer }),
    EffectsModule.forRoot([EmployeesEffects]),
    FormsModule      
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, 
    useClass: JwtInterceptor, 
    multi: true
  },
  DatePipe
],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faExclamation,faTrashCan,faPenToSquare,faEnvelope,faCalendarDays,faSearch);
  }
 }
