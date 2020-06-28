import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TaskService } from "../tasks.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Task } from "../tasks.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-show-task",
  templateUrl: "./show-task.component.html",
  styleUrls: ["./show-task.component.scss"],
})
export class ShowTaskComponent implements OnInit, OnDestroy {
  private taskId: string;
  task: Task;
  form: FormGroup;
  usersPerPage = 2;
  currentPage = 1;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public taskService: TaskService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("taskId")) {
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
        });
      }
    });
  }

  getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }

  onDelete(taskId: string) {
    this.isLoading = true;
    this.taskService.deleteTask(taskId).subscribe(
      () => {},
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
