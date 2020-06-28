import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CompanySelectionComponent } from "./company-selection/company-selection.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [LoginComponent, SignupComponent, CompanySelectionComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule {}
