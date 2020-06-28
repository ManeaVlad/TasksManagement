import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-company-selection",
  templateUrl: "./company-selection.component.html",
  styleUrls: ["./company-selection.component.scss"]
})
export class CompanySelectionComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  form: FormGroup;

  constructor(public authService: AuthService) {
    this.form = new FormGroup({
      company: new FormControl(null, {
        validators: [ Validators.minLength(3)],
      }),
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onSelection() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.companySelection(this.form.value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
