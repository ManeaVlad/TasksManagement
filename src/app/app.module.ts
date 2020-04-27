import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./components/auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./components/error/error.component";
import { AngularMaterialModule } from "./angular-material.module";
import { PostsModule } from "./components/posts/posts.module";
import { HeaderModule } from "./components/header-content/header-content.module";
import { TasksModule } from "./components/tasks/tasks.module";
import { ServicesModule } from "./components/services-page/services.module";
import { DashboardModule } from "./components/dashboard/dasboard.module";
import { FooterModule } from "./components/footer/footer.module";
import { AuthModule } from "./components/auth/auth.module";
import { UsersModule } from "./components/users/users.module";

@NgModule({
  declarations: [AppComponent, ErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    HeaderModule,
    TasksModule,
    ServicesModule,
    DashboardModule,
    FooterModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
