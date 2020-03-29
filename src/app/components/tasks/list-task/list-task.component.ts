import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from "@angular/core";
import { MatDialog, MatPaginator, MatSort } from "@angular/material";
import { CreateTaskComponent } from "../create-task/create-task.component";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Post } from "../../posts/post.model";

@Component({
  selector: "app-list-task",
  templateUrl: "./list-task.component.html",
  styleUrls: ["./list-task.component.scss"]
})
export class ListTaskComponent implements OnInit, OnDestroy {
  displayedColumns = [
    "id",
    "title"
    // "state",
    // "url",
    // "created_at",
    // "updated_at",
    // "actions"
  ];
  exampleDatabase: String | null;
  dataSource: ExampleDataSource | null;
  index: number;
  id: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  ngOnInit() {
  }

  ngOnDestroy() {}

  refresh() {
  }

  addNewTask(task: Post) {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      data: { task }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 1) {
    //     this.exampleDatabase.dataChange.value.push(
    //       this.dataService.getDialogData()
    //     );
    //     this.refreshTable();
    //   }
    // });
  }

  // startEdit(
  //   i: number,
  //   id: number,
  //   title: string,
  //   state: string,
  //   url: string,
  //   created_at: string,
  //   updated_at: string
  // ) {
  //   this.id = id;
  //   this.index = i;
  //   console.log(this.index);
  //   const dialogRef = this.dialog.open(EditDialogComponent, {
  //     data: {
  //       id: id,
  //       title: title,
  //       state: state,
  //       url: url,
  //       created_at: created_at,
  //       updated_at: updated_at
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 1) {
  //       const foundIndex = this.exampleDatabase.dataChange.value.findIndex(
  //         x => x.id === this.id
  //       );
  //       this.exampleDatabase.dataChange.value[
  //         foundIndex
  //       ] = this.dataService.getDialogData();
  //       this.refreshTable();
  //     }
  //   });
  // }

  // deleteItem(i: number, id: number, title: string, state: string, url: string) {
  //   this.index = i;
  //   this.id = id;
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     data: { id: id, title: title, state: state, url: url }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 1) {
  //       const foundIndex = this.exampleDatabase.dataChange.value.findIndex(
  //         x => x.id === this.id
  //       );
  //       this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
  //       this.refreshTable();
  //     }
  //   });
  // }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  // public loadData() {
  //   this.dataSource = new ExampleDataSource(
  //     // this.exampleDatabase,
  //     // this.paginator,
  //     // this.sort
  //   );
  //   fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
  //     if (!this.dataSource) {
  //       return;
  //     }
  //     this.dataSource.filter = this.filter.nativeElement.value;
  //   });
  // }
}

export class ExampleDataSource  {
  _filterChange = new BehaviorSubject("");

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Post[] = [];
  renderedData: Post[] = [];

  constructor(
    public _paginator: MatPaginator,
    public _sort: MatSort
  ) {
    this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
  }

  // connect(): Observable<Post[]> {
  //   const displayDataChanges = [
  //     this._sort.sortChange,
  //     this._filterChange,
  //     this._paginator.page
  //   ];

  //   return merge(...displayDataChanges).pipe(
  //     // map(() => {
  //     //   this.filteredData = this._exampleDatabase.data
  //     //     .slice()
  //     //     .filter((issue: Post) => {
  //     //       const searchStr = (
  //     //         issue.id +
  //     //         issue.title
  //     //        // issue.url +
  //     //        // issue.created_at
  //     //       ).toLowerCase();
  //     //       return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
  //     //     });
  //       const sortedData = this.sortData(this.filteredData.slice());
  //       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
  //       this.renderedData = sortedData.splice(
  //         startIndex,
  //         this._paginator.pageSize
  //       );
  //       return this.renderedData;
  //     })
  //   );
  // }

  // disconnect() {}

  // sortData(data: Post[]): Post[] {
  //   if (!this._sort.active || this._sort.direction === "") {
  //     return data;
  //   }

  //   return data.sort((a, b) => {
  //     let propertyA: number | string = "";
  //     let propertyB: number | string = "";

  //     switch (this._sort.active) {
  //       case "id":
  //         [propertyA, propertyB] = [a.id, b.id];
  //         break;
  //       case "title":
  //         [propertyA, propertyB] = [a.title, b.title];
  //         break;
  //       // case "state":
  //       //   [propertyA, propertyB] = [a.state, b.state];
  //       //   break;
  //       // case "url":
  //       //   [propertyA, propertyB] = [a.url, b.url];
  //       //   break;
  //       // case "created_at":
  //       //   [propertyA, propertyB] = [a.created_at, b.created_at];
  //       //   break;
  //       // case "updated_at":
  //       //   [propertyA, propertyB] = [a.updated_at, b.updated_at];
  //       //   break;
  //     }

  //     const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
  //     const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

  //     return (
  //       (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
  //     );
  //   });
  // }
}
