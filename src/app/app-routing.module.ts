import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateTaskComponent } from "./components/tasks/create-task/create-task.component";
import { ShowTaskComponent } from "./components/tasks/show-task/show-task.component";
import { ListTaskComponent } from "./components/tasks/list-task/list-task.component";
import { ScrumboardComponent } from "./components/tasks/scrumboard/scrumboard.component";
import { AuthGuard } from "./components/auth/auth.guard";
import { ServicesComponent } from "./components/services-page/services.component";
import { DashboardPageComponent } from "./components/dashboard/dashboard-page/dashboard-page.component";
import { ListUsersComponent } from "./components/users/list-user/list-user.component";
import { UsersCreateComponent } from "./components/users/users-create/edit-user.component";
import { CreateProjectComponent } from "./components/projects/create-project/create-project.component";
import { ShowProjectComponent } from "./components/projects/show-project/show-project.component";
import { ListProjectsComponent } from "./components/projects/list-project/list-project.component";

const routes: Routes = [
  { path: "services", component: ServicesComponent },
  {
    path: "dashboard",
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create-project",
    component: CreateProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-project/:projectId",
    component: CreateProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "show-project/:projectId",
    component: ShowProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "list-projects",
    component: ListProjectsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "users-table",
    component: ListUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-user/:userId",
    component: UsersCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: "auth", loadChildren: "./components/auth/auth.module#AuthModule" },
  {
    path: "user",
    loadChildren:
      "./components/header-content/header-content.module#HeaderModule",
  },
  {
    path: "create-task",
    component: CreateTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-task/:taskId",
    component: CreateTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "show-task/:taskId",
    component: ShowTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "list-task",
    component: ListTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "scrumboard",
    component: ScrumboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
