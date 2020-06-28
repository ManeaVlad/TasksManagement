import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";
import { Task } from "../../tasks/tasks.model";
import { TaskService } from "../..//tasks/tasks.service";

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public dashCard = [];
  isLoading = false;
  totalTasks = 0;
  totalTasksPending = 0;
  totalTasksInProgress = 0;
  totalTasksFinished = 0;
  totalTasksClosed = 0;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  userId: string;
  private taskSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.taskService.getTasks(1000, this.currentPage);
    this.userId = this.authService.getUserId();
    this.taskSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { task: Task[]; taskCount: number }) => {
        this.isLoading = false;
        this.totalTasks = taskData.taskCount;
        this.totalTasksPending = this.numberTasksByStates(
          taskData.task,
          "Pending"
        );
        this.totalTasksInProgress = this.numberTasksByStates(
          taskData.task,
          "In Progress"
        );
        this.totalTasksFinished = this.numberTasksByStates(
          taskData.task,
          "Finished"
        );
        this.totalTasksClosed = this.numberTasksByStates(
          taskData.task,
          "Closed"
        );
        this.dashCard = [
          {
            colorDark: "#5C6BC0",
            colorLight: "#7986CB",
            number: this.totalTasksPending,
            title: "PENDING",
            icon: "assignments",
          },
          {
            colorDark: "#42A5F5",
            colorLight: "#64B5F6",
            number: this.totalTasksInProgress,
            title: "IN PROGRESS",
            icon: "assignments",
          },
          {
            colorDark: "#26A69A",
            colorLight: "#4DB6AC",
            number: this.totalTasksFinished,
            title: "FINISHED",
            icon: "assignments",
          },
          {
            colorDark: "#66BB6A",
            colorLight: "#81C784",
            number: this.totalTasksClosed,
            title: "CLOSED",
            icon: "assignments",
          },
        ];
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  numberTasksByStates(taskData: Task[], state: string) {
    let numberTask = 0;
    let i;
    for (i = 0; i < taskData.length; i++) {
      if (taskData[i].state === state) {
        numberTask++;
      }
    }
    return numberTask;
  }

  ngOnDestroy() {
    this.taskSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
