import { Task } from "./tasks.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

const BACKEND_URL = "http://localhost:3000/api" + "/tasks/";

@Injectable({ providedIn: "root" })
export class TaskService {
  private task: Task[] = [];
  private taskUpdated = new Subject<{
    task: Task[];
    taskCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTasks(tasksPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${tasksPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; task: any; maxTasks: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((taskData) => {
          return {
            task: taskData.task.map((task) => {
              return {
                title: task.title,
                description: task.description,
                state: task.state,
                priority: task.priority,
                dueDate: task.dueDate,
                startDate: task.startDate,
                assignee: task.assignee,
                id: task._id,
                imagePath: task.imagePath,
                creator: task.creator,
                company: task.company,
                issueType: task.issueType,
                project: task.project,
              };
            }),
            maxTasks: taskData.maxTasks,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.task = transformedPostData.task;
        this.taskUpdated.next({
          task: [...this.task],
          taskCount: transformedPostData.maxTasks,
        });
      });
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  getTask(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      imagePath: string;
      creator: string;
      state: string;
      priority: string;
      assignee: string;
      dueDate: string;
      startDate: string;
      company: string;
      issueType: string;
      project: string;
    }>(BACKEND_URL + id);
  }

  addTask(
    title: string,
    description: string,
    image: File,
    state: string,
    priority: string,
    assignee: string,
    dueDate: string,
    startDate: string,
    issueType: string,
    project: string
  ) {
    const taskData = new FormData();
    taskData.append("title", title);
    taskData.append("description", description);
    taskData.append("image", image, title);
    taskData.append("state", state);
    taskData.append("priority", priority);
    taskData.append("assignee", assignee);
    taskData.append("dueDate", dueDate);
    taskData.append("startDate", startDate);
    taskData.append("issueType", issueType);
    taskData.append("project", project);
    this.http
      .post<{ message: string; task: Task }>(BACKEND_URL, taskData)
      .subscribe((responseData) => {
        this.router.navigate(["/list-task"]);
      });
  }

  updateTask(
    id: string,
    title: string,
    description: string,
    image: File | string,
    state: string,
    priority: string,
    assignee: string,
    dueDate: string,
    startDate: string,
    issueType: string,
    project: string
  ) {
    let taskData: Task | FormData;
    if (typeof image === "object") {
      taskData = new FormData();
      taskData.append("id", id);
      taskData.append("title", title);
      taskData.append("description", description);
      taskData.append("image", image, title);
      taskData.append("state", state);
      taskData.append("priority", priority);
      taskData.append("assignee", assignee);
      taskData.append("dueDate", dueDate);
      taskData.append("startDate", startDate);
      taskData.append("issueType", issueType);
      taskData.append("project", project);
    } else {
      taskData = {
        id,
        title,
        description,
        imagePath: image,
        creator: null,
        state,
        priority,
        assignee,
        dueDate,
        startDate,
        company: null,
        issueType,
        project,
      };
    }
    this.http.patch(BACKEND_URL + id, taskData).subscribe((response) => {
      this.router.navigate(["/list-task"]);
    });
  }

  deleteTask(taskId: string) {
    return this.http.delete(BACKEND_URL + taskId);
  }

  updateTaskByStatePending(id: string) {
    this.http
      .patch(BACKEND_URL + "pending/" + id, "")
      .subscribe((response) => {});
  }

  updateTaskByStateInProgress(id: string) {
    this.http
      .patch(BACKEND_URL + "inProgress/" + id, "")
      .subscribe((response) => {});
  }

  updateTaskByStateFinished(id: string) {
    this.http
      .patch(BACKEND_URL + "finished/" + id, "")
      .subscribe((response) => {});
  }
}
