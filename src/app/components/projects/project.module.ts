import { NgModule } from "@angular/core";
import { CreateProjectComponent } from "./create-project/create-project.component";
import { ListProjectsComponent } from "./list-project/list-project.component";
import { ShowProjectComponent } from "./show-project/show-project.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    CreateProjectComponent,
    ListProjectsComponent,
    ShowProjectComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
})
export class ProjectsModule {}
