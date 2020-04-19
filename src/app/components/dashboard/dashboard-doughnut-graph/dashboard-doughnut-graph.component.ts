import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";

@Component({
  selector: "app-dashboard-doughnut-graph",
  templateUrl: "./dashboard-doughnut-graph.component.html",
  styleUrls: ["./dashboard-doughnut-graph.component.scss"]
})
export class DoughnutGraphComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.createDoughnutGraph();
    }, 500);
  }
  randomNumber(min = 0, max = 0) {
    if (min == 0 || max == 0) return Math.round(Math.random() * 100);
    else return Math.random() * (max - min) + min;
  }
  randomBar(date, lastClose) {
    let open = this.randomNumber(lastClose * 0.95, lastClose * 1.05);
    let close = this.randomNumber(open * 0.95, open * 1.05);
    let high = this.randomNumber(
      Math.max(open, close),
      Math.max(open, close) * 1.1
    );
    let low = this.randomNumber(
      Math.min(open, close) * 0.9,
      Math.min(open, close)
    );
    return {
      t: date.valueOf(),
      y: close
    };
  }

  createDoughnutGraph() {
    new Chart("doughnut-graph-graph", {
      type: "doughnut",
      data: {
        labels: ["Data "],
        datasets: [
          {
            data: [
              this.randomNumber(),
              this.randomNumber(),
              this.randomNumber(),
              this.randomNumber()
            ],
            backgroundColor: [
              "rgba(255, 99, 132,.7)",
              "rgba(92, 107, 192,.7)",
              "rgba(66, 165, 245,.7)",
              "rgba(38, 166, 154,.7)",
              "rgba(102, 187, 106,.7)"
            ]
          }
        ]
      },
      options: {
        elements: {
          line: {
            tension: 0.000001
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          filler: {
            propagate: false
          }
        },
        title: {
          display: true,
          text: "TASKS STATUS"
        }
      }
    });
  }
}
