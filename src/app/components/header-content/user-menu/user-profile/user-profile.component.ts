import { OnInit, OnDestroy, Component } from "@angular/core";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isLoading = false;

  constructor() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
