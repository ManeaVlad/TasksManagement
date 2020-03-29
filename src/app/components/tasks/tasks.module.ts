import { NgModule } from "@angular/core";
import { ScrumboardComponent } from "./scrumboard/scrumboard.component";
import { ListTaskComponent } from "./list-task/list-task.component";
import { CreateTaskComponent } from "./create-task/create-task.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ScrumboardComponent, ListTaskComponent, CreateTaskComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class TasksModule {}
