import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { Subscription } from "rxjs";
import { Task } from "../../tasks/tasks.model";
import { TaskService } from "../..//tasks/tasks.service";

@Component({
  selector: "app-dashboard-bar-graph",
  templateUrl: "./dashboard-bar-graph.component.html",
  styleUrls: ["./dashboard-bar-graph.component.scss"],
})
export class BarGraphComponent implements OnInit {
  totalTasksBug = [];
  totalTasksRegression = [];
  totalTasksDevOps = [];
  totalTasksStory = [];
  tasksPerPage = 1000;
  currentPage = 1;
  private taskSub: Subscription;

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.taskSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { task: Task[]; taskCount: number }) => {
        this.totalTasksBug = this.numberTasksByStates(taskData.task, "Bug");
        this.totalTasksRegression = this.numberTasksByStates(
          taskData.task,
          "Regression"
        );
        this.totalTasksDevOps = this.numberTasksByStates(
          taskData.task,
          "DevOps"
        );
        this.totalTasksStory = this.numberTasksByStates(taskData.task, "Story");
      });
    setTimeout(() => {
      this.createBarGraph();
    }, 500);
  }

  numberTasksByStates(taskData: Task[], state: string) {
    let numberTask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let i;
    for (i = 0; i < taskData.length; i++) {
      if (taskData[i].issueType === state) {
        numberTask[new Date(taskData[i].startDate).getMonth()]++;
      }
    }
    return numberTask;
  }

  createBarGraph() {
    new Chart("dash-bar-graph", {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            backgroundColor: "rgba(92, 107, 192, .7)",
            borderColor: "rgba(92, 107, 192, .7)",
            data: this.totalTasksBug,
            label: "Bug",
            fill: "false",
          },
          {
            backgroundColor: "rgba(66, 165, 245, .7)",
            borderColor: "rgba(69, 39, 160, .7)",
            data: this.totalTasksRegression,
            label: "Regression",
            fill: "false",
          },
          {
            backgroundColor: "rgba(38, 166, 154, .7)",
            borderColor: "rgba(69, 39, 160, .7)",
            data: this.totalTasksDevOps,
            label: "DevOps",
            fill: "false",
          },
          {
            backgroundColor: "rgba(102, 187, 106, .7)",
            borderColor: "rgba(255, 99, 132)",
            data: this.totalTasksStory,
            label: "Story",
            fill: "false",
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        elements: {
          line: {
            tension: 0.000001,
          },
        },
        maintainAspectRatio: false,
        plugins: {
          filler: {
            propagate: false,
          },
        },
        title: {
          display: true,
          text: "TASKS CREATED",
        },
      },
    });
  }
}
