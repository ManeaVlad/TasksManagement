import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ListUsersComponent } from "./list-user/list-user.component";
import { UsersCreateComponent } from "./users-create/edit-user.component";

@NgModule({
  declarations: [ListUsersComponent, UsersCreateComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
})
export class UsersModule {}
