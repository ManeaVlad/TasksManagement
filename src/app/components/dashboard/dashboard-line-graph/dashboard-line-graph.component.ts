import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { Subscription } from "rxjs";
import { Task } from "../../tasks/tasks.model";
import { TaskService } from "../..//tasks/tasks.service";

@Component({
  selector: "app-dashboard-line-graph",
  templateUrl: "./dashboard-line-graph.component.html",
  styleUrls: ["./dashboard-line-graph.component.scss"],
})
export class LineGraphComponent implements OnInit {
  totalTasks = [];
  tasksPerPage = 1000;
  currentPage = 1;
  private taskSub: Subscription;

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.taskSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { task: Task[]; taskCount: number }) => {
        this.totalTasks = this.numberTasks(taskData.task);
      });
    setTimeout(() => {
      this.createLineChart();
    }, 500);
  }

  numberTasks(taskData: Task[]) {
    let numberTask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let i;
    for (i = 0; i < taskData.length; i++) {
      numberTask[new Date(taskData[i].startDate).getMonth()]++;
    }
    return numberTask;
  }

  createLineChart() {
    new Chart("line-graph", {
      type: "line",
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
            backgroundColor: "rgba(92, 107, 192, 0.36)",
            borderColor: "rgba(92, 107, 192,.5)",
            data: this.totalTasks,
            label: "Tasks Assigned",
            fill: "start",
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
        plugins: {
          filler: {
            propagate: false,
          },
        },
        title: {
          display: true,
          text: "ASSIGNMENTS GRAPH",
        },
      },
    });
  }
}
