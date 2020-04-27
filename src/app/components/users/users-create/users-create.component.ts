import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { Users } from "../users.model";
import { FormComponent } from "../../auth/infrasturcture-forms/form-component";

@Component({
  selector: "app-users-create",
  templateUrl: "./users-create.component.html",
  styleUrls: ["./users-create.component.scss"],
})
export class UsersCreateComponent extends FormComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @ts-ignore
  @ViewChild("email") firstItem: ElementRef;
  form!: FormGroup;
  hidePassword = true;
  description: string;
  imagePreview: any;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UsersCreateComponent>,
    @Inject(MAT_DIALOG_DATA) data: Users
  ) {
    super();
    this.validationMessages = {
      userName: {
        required: "User name is required.",
        minlength: "User name minimum length is 6.",
        maxlength: "User name maximum length is 15.",
        pattern: "User name minimum length is 6.",
      },
      password: {
        required: "Password is required.",
        minlength: "Password minimum length is 6.",
        maxlength: "Password maximum length is 15.",
        pattern:
          "Password minimum length is 6, requires one letter, one number, one special character !@#$%^&* no spaces.",
      },
      email: {
        required: "Email is required.",
        email: "Email is not properly formatted.",
      },
    };
    this.formErrors = {
      userName: "",
      email: "",
      password: "",
    };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      activeUser: [],
      isAdmin: [],
      role: [],
      companyName: [],
      userName: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern("^[a-zA-Z0-9]*$"),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(
            "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$"
          ),
        ],
      ],
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
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
      console.log(this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
