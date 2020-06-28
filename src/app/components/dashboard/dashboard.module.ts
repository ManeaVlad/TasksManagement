import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Ng2OdometerModule } from "ng2-odometer";
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { DashboardCardComponent } from "./dashboard-card/dashboard-card.component";
import { DoughnutGraphComponent } from "./dashboard-doughnut-graph/dashboard-doughnut-graph.component";
import { BarGraphComponent } from "./dashboard-bar-graph/dashboard-bar-graph.component";
import { LineGraphComponent } from "./dashboard-line-graph/dashboard-line-graph.component";

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardCardComponent,
    DoughnutGraphComponent,
    BarGraphComponent,
    LineGraphComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    Ng2OdometerModule
  ]
})
export class DashboardModule {}
