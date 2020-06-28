import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "../users.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Users } from "../users.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class UsersCreateComponent implements OnInit, OnDestroy {
  private userId: string;
  user: Users;
  form: FormGroup;
  imagePreview: any;
  isLoading = false;
  values = [
    {
      value: true,
    },
    {
      value: false,
    },
  ];
  private authStatusSub: Subscription;

  constructor(
    public usersService: UsersService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      userName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      isAdmin: new FormControl(),
      activeUser: new FormControl(),
      phone: new FormControl(null, {
        validators: [Validators.minLength(3)],
      }),
      role: new FormControl(null, {
        validators: [Validators.minLength(5)],
      }),
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("userId")) {
        this.userId = paramMap.get("userId");
        this.isLoading = true;
        this.usersService.getUser(this.userId).subscribe((postData) => {
          this.isLoading = false;
          this.user = {
            id: postData._id,
            userName: postData.userName,
            email: postData.email,
            companyName: postData.companyName,
            isAdmin: postData.isAdmin,
            activeUser: postData.activeUser,
            phone: postData.phone,
            role: postData.role,
          };
          this.form.setValue({
            userName: this.user.userName,
            email: this.user.email,
            isAdmin: this.user.isAdmin,
            activeUser: this.user.activeUser,
            phone: this.user.phone,
            role: this.user.role,
          });
        });
      }
    });
  }

  getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.usersService.updateUser(
      this.userId,
      this.form.value.userName,
      this.form.value.email,
      this.form.value.isAdmin,
      this.form.value.activeUser,
      this.form.value.phone,
      this.form.value.role
    );
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
