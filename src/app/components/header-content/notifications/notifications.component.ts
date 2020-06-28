import { Component, OnInit, OnDestroy, Input, ElementRef } from "@angular/core";
import { HeaderService } from "../header-content.service";

@Component({
  selector: "app-notifications-header",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class HeaderNotificationComponent implements OnInit, OnDestroy {
  cssPrefix = "header-notifications";
  isOpen = false;
  @Input() notifications = [];
  constructor(
    private elementRef: ElementRef,
    public notificationService: HeaderService
  ) {}
  ngOnInit() {}
  updateNotification(id: string) {
    this.notificationService.updateNotification(id);
  }
  ngOnDestroy() {}
}
