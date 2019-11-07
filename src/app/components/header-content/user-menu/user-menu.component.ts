import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { HeaderService } from '../header-content.service';

@Component({
  selector: "app-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit, OnDestroy {
  isOpen = false;
  @Input() currentUser = null;
  constructor(private headerService: HeaderService) {}
  ngOnInit() {}
  ngOnDestroy() {}
}
