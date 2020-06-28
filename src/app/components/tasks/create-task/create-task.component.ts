import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { map, startWith } from "rxjs/operators";
import { Subscription, Observable } from "rxjs";
import { mimeType } from "../../projects/create-project/mime-type.validator";
import { TaskService } from "../tasks.service";
import { Task } from "../tasks.model";
import { UsersService } from "../../users/users.service";
import { Users } from "../../users/users.model";
import { ProjectService } from "../../projects/project.service";
import { Project } from "../../projects/project.model";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.scss"],
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  private mode: string;
  private taskId: string;
  task: Task;
  usersPerPage = 2;
  currentPage = 1;
  imagePreview: any;
  private modes = {
    CREATE: "create",
    EDIT: "edit",
  };
  private projectSub: Subscription;
  private userSub: Subscription;
  private authStatusSub: Subscription;
  filteredAssignees: Observable<any[]>;
  projects: any[] = [];
  issueTypes = [
    {
      name: "Bug",
    },
    {
      name: "Regression",
    },
    {
      name: "DevOps",
    },
    {
      name: "Story",
    },
  ];
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
    {
      name: "Epic",
    },
    {
      name: "Spike",
    },
  ];
  states = [
    {
      name: "Pending",
    },
    {
      name: "In Progress",
    },
    {
      name: "Finished",
    },
    {
      name: "Closed",
    },
  ];
  assignees: any[] = [];

  constructor(
    public projectService: ProjectService,
    public taskService: TaskService,
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
      priority: new FormControl(),
      assignee: new FormControl(),
      state: new FormControl(),
      project: new FormControl(),
      issueType: new FormControl(),
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
    this.projectService.getProjects(this.usersPerPage, this.currentPage);
    this.projectSub = this.projectService
      .getProjectUpdateListener()
      .subscribe(
        (projectData: { project: Project[]; projectCount: number }) => {
          this.projects = projectData.project;
        }
      );
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("taskId")) {
        this.mode = this.modes.EDIT;
        this.taskId = paramMap.get("taskId");
        this.isLoading = true;
        this.taskService.getTask(this.taskId).subscribe((postData) => {
          this.isLoading = false;
          this.task = {
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
            issueType: postData.issueType,
            project: postData.project,
          };
          this.form.setValue({
            title: this.task.title,
            description: this.task.description,
            image: this.task.imagePath,
            priority: this.task.priority,
            assignee: this.task.assignee,
            state: this.task.state,
            issueType: this.task.issueType,
            project: this.task.project,
            dueDate: new Date(this.task.dueDate),
            startDate: new Date(this.task.startDate),
          });
        });
      } else {
        this.mode = this.modes.CREATE;
        this.taskId = null;
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

  onSaveTask() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === this.modes.CREATE) {
      this.taskService.addTask(
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.state,
        this.form.value.priority,
        this.form.value.assignee,
        this.form.value.dueDate.toLocaleString(),
        this.form.value.startDate.toLocaleString(),
        this.form.value.issueType,
        this.form.value.project
      );
    } else {
      this.taskService.updateTask(
        this.taskId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.state,
        this.form.value.priority,
        this.form.value.assignee,
        this.form.value.dueDate.toLocaleString(),
        this.form.value.startDate.toLocaleString(),
        this.form.value.issueType,
        this.form.value.project
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
