import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { HeaderNotificationComponent } from "./notifications/notifications.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { UserProfileComponent } from "./user-menu/user-profile/user-profile.component";
import { HeaderRoutingModule } from './header-content-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderNotificationComponent,
    UserMenuComponent,
    UserProfileComponent
  ],
  imports: [CommonModule, AngularMaterialModule, HeaderRoutingModule],
  exports: [HeaderComponent]
})
export class HeaderModule {}
