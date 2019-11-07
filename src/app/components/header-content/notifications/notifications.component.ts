import { Component, OnInit, OnDestroy, Input, ElementRef } from "@angular/core";

@Component({
  selector: "app-notifications-header",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class HeaderNotificationComponent implements OnInit, OnDestroy {
  cssPrefix = "header-notifications";
  isOpen = false;
  @Input() notifications = [];
  constructor(private elementRef: ElementRef) {}
  ngOnInit() {}
  delete(notification) {}
  ngOnDestroy() {}
}
