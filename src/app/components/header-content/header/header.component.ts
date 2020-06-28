import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { HeaderService } from "../header-content.service";
import { Notifications } from "../notifications.model";
import { Subscription, Observable } from "rxjs";
import {
  BreakpointState,
  BreakpointObserver,
  Breakpoints,
} from "@angular/cdk/layout";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userIsAdmin = false;
  totalNotifications = 0;
  notification;
  userName = "Unknown";
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;
  private userNameListenerSubs: Subscription;
  private notificationSub: Subscription;
  @Input() sidenav;
  @Input() drawer;
  @Input() matDrawerShow;
  @Input() sidebar;

  constructor(
    private authService: AuthService,
    private notificationService: HeaderService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.getNotifications();
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.getIsAdmin();
    this.userName = this.authService.getUser();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.adminListenerSubs = this.authService
      .getAdminStatusListener()
      .subscribe((isAdmin) => {
        this.userIsAdmin = isAdmin;
      });
    this.userNameListenerSubs = this.authService
      .getUserNameStatusListener()
      .subscribe((userValue) => {
        this.userName = userValue;
      });
  }

  getNotifications() {
    if (this.userIsAuthenticated) {
      this.notificationService.getNotifications();
      this.notificationSub = this.notificationService
        .getNotificationUpdateListener()
        .subscribe(
          (notificationData: {
            notification: Notifications[];
            notificationCount: number;
          }) => {
            this.totalNotifications = notificationData.notificationCount;
            this.notification = notificationData.notification;
          }
        );
    }
  }

  theRunner = setInterval(() => {
    this.getNotifications();
  }, 60000);

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
