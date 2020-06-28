import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { HeaderNotificationComponent } from "./notifications/notifications.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderNotificationComponent,
    UserMenuComponent,
  ],
  imports: [CommonModule, AngularMaterialModule, RouterModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
