import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormComponent } from "../infrasturcture-forms/form-component";
import { ErrorMatcher } from "../infrasturcture-forms/error-matcher";
import { passwordsDoNotMatch } from "../infrasturcture-forms/passwords-do-not-match.validator";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent extends FormComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @ts-ignore
  @ViewChild("email") firstItem: ElementRef;
  form!: FormGroup;
  hidePassword = true;
  errorMatcher = new ErrorMatcher();
  isLoading = false;
  showCompanyInput = false;
  private authStatusSub: Subscription;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder
  ) {
    super();
    this.validationMessages = {
      companyName: {
        maxlength: "User name maximum length is 15."
      },
      userName: {
        required: "User name is required.",
        minlength: "User name minimum length is 6.",
        maxlength: "User name maximum length is 15.",
        pattern: "User name minimum length is 6."
      },
      password: {
        required: "Password is required.",
        minlength: "Password minimum length is 6.",
        maxlength: "Password maximum length is 15.",
        pattern:
          "Password minimum length is 6, requires one letter, one number, one special character !@#$%^&* no spaces."
      },
      confirmPassword: {
        required: "Confirm password is required.",
        minlength: "Confirm password minimum length is 6.",
        maxlength: "Confirm password maximum length is 15.",
        pattern:
          "Confirm password minimum length is 6, requires one letter, one number, one special character !@#$%^&* no spaces.",
        passwordsDoNotMatch: "Passwords must match."
      },
      email: {
        required: "Email is required.",
        email: "Email is not properly formatted."
      },
      passwordsGroup: {
        passwordsDoNotMatch: "Passwords must match."
      }
    };

    this.formErrors = {
      companyName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      passwordsGroup: ""
    };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      companyName: ["", [Validators.maxLength(15)]],
      userName: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[a-zA-Z0-9]*$")
        ]
      ],
      email: ["", [Validators.required, Validators.email]],
      passwordsGroup: this.formBuilder.group(
        {
          password: [
            "",
            [
              Validators.required,
              Validators.maxLength(15),
              Validators.pattern(
                "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$"
              )
            ]
          ],
          confirmPassword: [
            "",
            [
              Validators.required,
              Validators.maxLength(15),
              Validators.pattern(
                "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$"
              )
            ]
          ]
        },
        { validators: passwordsDoNotMatch }
      )
    });
    this.showCompanyInput = false;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstItem.nativeElement.focus();
    }, 250);
    this.startControlMonitoring(this.form);
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.createUser(this.form.value);
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
