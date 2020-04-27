import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { UsersTableComponent } from "./users-table/users-table.component";
import { UsersCreateComponent } from "./users-create/users-create.component";

@NgModule({
  declarations: [UsersTableComponent, UsersCreateComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
})
export class UsersModule {}
