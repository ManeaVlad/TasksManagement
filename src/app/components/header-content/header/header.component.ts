import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Subscription, Observable } from "rxjs";
import {
  BreakpointState,
  BreakpointObserver,
  Breakpoints
} from "@angular/cdk/layout";
import { HeaderHelpers } from "./header.helpers";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userIsAdmin = false;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  private authListenerSubs: Subscription;
  @Input() sidenav;
  @Input() drawer;
  @Input() matDrawerShow;
  @Input() sidebar;
  headerHelpers = HeaderHelpers;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
