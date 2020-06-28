import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProjectService } from "../project.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Project } from "../project.model";
import { mimeType } from "./mime-type.validator";
import { Subscription, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../users/users.service";
import { Users } from "../../users/users.model";

@Component({
  selector: "app-create-project",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.scss"],
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  private mode: string;
  private projectId: string;
  project: Project;
  form: FormGroup;
  usersPerPage = 2;
  currentPage = 1;
  imagePreview: any;
  isLoading = false;
  private modes = {
    CREATE: "create",
    EDIT: "edit",
  };
  private userSub: Subscription;
  private authStatusSub: Subscription;
  filteredAssignees: Observable<any[]>;
  assignees: any[] = [];
  priorities = [
    {
      name: "Minor",
    },
    {
      name: "Major",
    },
    {
      name: "Critical",
    },
    {
      name: "Blocker",
    },
  ];

  constructor(
    public projectService: ProjectService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public userService: UsersService
  ) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
      priority: new FormControl(null, { validators: [Validators.required] }),
      assignee: new FormControl(),
      dueDate: new FormControl(new Date()),
      startDate: new FormControl(new Date()),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.filteredAssignees = this.form.controls.assignee.valueChanges.pipe(
      startWith(null),
      map((assignee) =>
        assignee ? this.filterAssignees(assignee) : this.assignees.slice()
      )
    );
  }

  filterAssignees(name: string) {
    return this.assignees.filter(
      (assignee) =>
        assignee.userName.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  ngOnInit() {
    this.userService.getUsers(this.usersPerPage, this.currentPage);
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((userData: { user: Users[]; userCount: number }) => {
        this.assignees = userData.user;
      });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("projectId")) {
        this.mode = this.modes.EDIT;
        this.projectId = paramMap.get("projectId");
        this.isLoading = true;
        this.projectService.getProject(this.projectId).subscribe((postData) => {
          this.isLoading = false;
          this.project = {
            id: postData._id,
            title: postData.title,
            description: postData.description,
            imagePath: postData.imagePath,
            creator: postData.creator,
            priority: postData.priority,
            state: postData.state,
            assignee: postData.assignee,
            dueDate: postData.dueDate,
            startDate: postData.startDate,
            company: postData.company,
          };
          this.form.setValue({
            title: this.project.title,
            description: this.project.description,
            image: this.project.imagePath,
            priority: this.project.priority,
            assignee: this.project.assignee,
            dueDate: new Date(this.project.dueDate),
            startDate: new Date(this.project.startDate),
          });
        });
      } else {
        this.mode = this.modes.CREATE;
        this.projectId = null;
      }
    });
  }

  getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveProject() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === this.modes.CREATE) {
      this.projectService.addProject(
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.priority,
        this.form.value.assignee,
        this.form.value.dueDate.toLocaleString(),
        this.form.value.startDate.toLocaleString()
      );
    } else {
      this.projectService.updateProject(
        this.projectId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.state,
        this.form.value.priority,
        this.form.value.assignee,
        this.form.value.dueDate.toLocaleString(),
        this.form.value.startDate.toLocaleString()
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
