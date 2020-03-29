import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./components/posts/list/list.component";
import { CreateComponent } from "./components/posts/create/create.component";
import { CreateTaskComponent } from "./components/tasks/create-task/create-task.component";
import { ListTaskComponent } from "./components/tasks/list-task/list-task.component";
import { ScrumboardComponent } from "./components/tasks/scrumboard/scrumboard.component";
import { AuthGuard } from "./components/auth/auth.guard";

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: "create", component: CreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:postId",
    component: CreateComponent,
    canActivate: [AuthGuard]
  },
  { path: "auth", loadChildren: "./components/auth/auth.module#AuthModule" },
  {
    path: "user",
    loadChildren:
      "./components/header-content/header-content.module#HeaderModule"
  },
  {
    path: "create-task",
    component: CreateTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "list-task",
    component: ListTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "scrumboard",
    component: ScrumboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
