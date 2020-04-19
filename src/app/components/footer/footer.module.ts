import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./footer.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, AngularMaterialModule, RouterModule],
  exports: [FooterComponent]
})
export class FooterModule {}
