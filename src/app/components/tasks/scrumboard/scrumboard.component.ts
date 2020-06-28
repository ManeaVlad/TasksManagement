import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaskService } from "../tasks.service";
import { Subscription } from "rxjs";
import { Task } from "../tasks.model";

@Component({
  selector: "app-scrumboard",
  templateUrl: "./scrumboard.component.html",
  styleUrls: ["./scrumboard.component.scss"],
})
export class ScrumboardComponent implements OnInit, OnDestroy {
  tasksPending: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksFinished: Task[] = [];
  deviceObjects = [{ name: 1 }, { name: 2 }, { name: 3 }];
  selectedDeviceObj = this.deviceObjects[1];
  private taskSub: Subscription;
  tasksPerPage = 1000;
  currentPage = 1;
  developers: Array<string> = [];
  testers: Array<string> = [];

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.taskSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { task: Task[]; taskCount: number }) => {
        let i = 0;
        for (i = 0; i < taskData.task.length; i++) {
          if (taskData.task[i].state === "Pending") {
            this.tasksPending.push(taskData.task[i]);
          }
          if (taskData.task[i].state === "In Progress") {
            this.tasksInProgress.push(taskData.task[i]);
          }
          if (taskData.task[i].state === "Finished") {
            this.tasksFinished.push(taskData.task[i]);
          }
        }
      });
  }

  addToInProgress($event) {
    if ($event) {
      this.taskService.updateTaskByStateInProgress($event.id);
    }
  }
  addToPending($event) {
    if ($event) {
      this.taskService.updateTaskByStatePending($event.id);
    }
  }
  addToFinished($event) {
    if ($event) {
      this.taskService.updateTaskByStateFinished($event.id);
    }
  }

  onChangeObj(newObj) {
    this.selectedDeviceObj = newObj;
  }

  ngOnDestroy() {}
}
