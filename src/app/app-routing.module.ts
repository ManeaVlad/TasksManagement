import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./components/posts/list/list.component";
import { CreateComponent } from "./components/posts/create/create.component";
import { AuthGuard } from "./components/auth/auth.guard";

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: "create", component: CreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:postId",
    component: CreateComponent,
    canActivate: [AuthGuard]
  },
  { path: "auth", loadChildren: "./components/auth/auth.module#AuthModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
