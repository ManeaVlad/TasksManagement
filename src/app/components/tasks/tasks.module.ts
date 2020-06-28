import { NgModule } from "@angular/core";
import { ScrumboardComponent } from "./scrumboard/scrumboard.component";
import { ListTaskComponent } from "./list-task/list-task.component";
import { CreateTaskComponent } from "./create-task/create-task.component";
import { ShowTaskComponent } from "./show-task/show-task.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DndModule } from "ng2-dnd";

@NgModule({
  declarations: [
    ScrumboardComponent,
    ListTaskComponent,
    CreateTaskComponent,
    ShowTaskComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    DndModule.forRoot(),
  ],
})
export class TasksModule {}
