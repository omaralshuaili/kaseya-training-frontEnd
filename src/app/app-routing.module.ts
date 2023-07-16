import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListingComponent } from './listing/listing.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path : 'listings', component:ListingComponent},
  {path:'register', component:RegisterComponent},
  {path : '' , component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
