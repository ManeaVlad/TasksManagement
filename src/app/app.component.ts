import { Component, OnInit } from "@angular/core";
import { AuthService } from "./components/auth/auth.service";

// create decorator just to learn
// function log(target, name, descriptor) {
//   console.log(target, name, descriptor);
//   const original = descriptor.value;
//   original();
//   return descriptor;
// }

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
