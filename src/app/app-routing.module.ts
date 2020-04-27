import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./components/posts/list/list.component";
import { CreateComponent } from "./components/posts/create/create.component";
import { CreateTaskComponent } from "./components/tasks/create-task/create-task.component";
import { ListTaskComponent } from "./components/tasks/list-task/list-task.component";
import { ScrumboardComponent } from "./components/tasks/scrumboard/scrumboard.component";
import { AuthGuard } from "./components/auth/auth.guard";
import { ServicesComponent } from "./components/services-page/services.component";
import { DashboardPageComponent } from "./components/dashboard/dashboard-page/dasboard-page.component";
import { UsersTableComponent } from "./components/users/users-table/users-table.component";
import { UsersCreateComponent } from "./components/users/users-create/users-create.component";

const routes: Routes = [
  { path: "services", component: ServicesComponent },
  {
    path: "dashboard",
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
  { path: "", component: ListComponent },
  { path: "create", component: CreateComponent, canActivate: [AuthGuard] },
  { path: "users-table", component: UsersTableComponent },
  { path: "users-create", component: UsersCreateComponent },
  {
    path: "edit/:postId",
    component: CreateComponent,
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
