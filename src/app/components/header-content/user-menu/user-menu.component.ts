import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { HeaderService } from "../header-content.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"],
})
export class UserMenuComponent implements OnInit, OnDestroy {
  isOpen = false;
  @Input() currentUser = null;
  constructor(
    private headerService: HeaderService,
    private authService: AuthService
  ) {}
  ngOnInit() {}

  openSnackBar() {
    this.headerService.getCompanyId().subscribe(
      (content) => {
        alert("Company ID: " + content.company);
      },
      (error) => {}
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {}
}
