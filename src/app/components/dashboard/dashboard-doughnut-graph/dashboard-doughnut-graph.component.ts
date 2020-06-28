import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { TaskService } from "../..//tasks/tasks.service";
import { Subscription } from "rxjs";
import { Task } from "../../tasks/tasks.model";

@Component({
  selector: "app-dashboard-doughnut-graph",
  templateUrl: "./dashboard-doughnut-graph.component.html",
  styleUrls: ["./dashboard-doughnut-graph.component.scss"],
})
export class DoughnutGraphComponent implements OnInit {
  totalTasksPending = 0;
  totalTasksInProgress = 0;
  totalTasksFinished = 0;
  totalTasksClosed = 0;
  tasksPerPage = 1000;
  currentPage = 1;
  private taskSub: Subscription;

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.taskSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { task: Task[]; taskCount: number }) => {
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
      });
    setTimeout(() => {
      this.createDoughnutGraph();
    }, 500);
  }

  randomNumber(min = 0, max = 0) {
    if (min === 0 || max === 0) {
      return Math.round(Math.random() * 100);
    } else {
      return Math.random() * (max - min) + min;
    }
  }

  randomBar(date, lastClose) {
    const open = this.randomNumber(lastClose * 0.95, lastClose * 1.05);
    const close = this.randomNumber(open * 0.95, open * 1.05);
    return {
      t: date.valueOf(),
      y: close,
    };
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

  createDoughnutGraph() {
    new Chart("doughnut-graph-graph", {
      type: "doughnut",
      data: {
        labels: ["Pending", "In Progress", "Finished", "Closed"],
        datasets: [
          {
            data: [
              this.totalTasksPending,
              this.totalTasksInProgress,
              this.totalTasksFinished,
              this.totalTasksClosed,
            ],
            backgroundColor: [
              "rgba(255, 99, 132,.7)",
              "rgba(92, 107, 192,.7)",
              "rgba(66, 165, 245,.7)",
              "rgba(38, 166, 154,.7)",
              "rgba(102, 187, 106,.7)",
            ],
          },
        ],
      },
      options: {
        elements: {
          line: {
            tension: 0.000001,
          },
        },
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          filler: {
            propagate: false,
          },
        },
        title: {
          display: true,
          text: "TASKS STATUS",
        },
      },
    });
  }
}
