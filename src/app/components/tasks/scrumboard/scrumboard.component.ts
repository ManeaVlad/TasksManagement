import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-scrumboard",
  templateUrl: "./scrumboard.component.html",
  styleUrls: ["./scrumboard.component.scss"],
})
export class ScrumboardComponent implements OnInit, OnDestroy {
  tasks: Array<string> = [
    "Sugar Ray Robinson",
    "Muhammad Ali",
    "George Foreman",
    "Joe Frazier",
    "Jake LaMotta",
    "Joe Louis",
    "Jack Dempsey",
    "Rocky Marciano",
    "Mike Tyson",
    "Oscar De La Hoya",
  ];
  deviceObjects = [{name: 1}, {name: 2}, {name: 3}];
  selectedDeviceObj = this.deviceObjects[1];
  developers: Array<string> = [];
  testers: Array<string> = [];

  ngOnInit() {}

  addToInProgress($event) {
    console.log($event);
    if ($event) {
      // this.developers.push($event);
    }
 }
 addToPending($event) {
  console.log($event);
  if ($event) {
    // this.developers.push($event);
  }
}
addToFinished($event) {
  console.log($event);
  if ($event) {
    // this.developers.push($event);
  }
}

  onChangeObj(newObj) {
    console.log(newObj);
    this.selectedDeviceObj = newObj;
  }

  ngOnDestroy() {}
}
