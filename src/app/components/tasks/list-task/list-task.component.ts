import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { Task } from "../tasks.model";
import { TaskService } from "../tasks.service";
import {
  PageEvent,
  MatSort,
  MatTableDataSource,
  MatPaginator,
} from "@angular/material";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-list-tasks",
  templateUrl: "./list-task.component.html",
  styleUrls: ["./list-task.component.scss"],
})
export class ListTaskComponent implements OnInit, OnDestroy {
  task: MatTableDataSource<any>;
  isLoading = false;
  totalTasks = 0;
  tasksPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  searchKey: string;
  userId: string;
  filterSelectObj = [];
  filterValues = {};
  private taskSub: Subscription;
  private authStatusSub: Subscription;
  displayedColumns: string[] = [
    "title",
    "creator",
    "state",
    "priority",
    "assignee",
    "issueType",
    "project",
    "startDate",
    "dueDate",
    "actions",
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public taskService: TaskService,
    private authService: AuthService
  ) {
    this.filterSelectObj = [
      {
        name: "Projects",
        columnProp: "project",
        options: [],
      },
    ];
  }

  ngOnInit() {
    this.isLoading = true;
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.taskSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { task: Task[]; taskCount: number }) => {
        this.isLoading = false;
        this.totalTasks = taskData.taskCount;
        this.task = new MatTableDataSource(taskData.task);
        this.task.sort = this.sort;
        this.task.paginator = this.paginator;
        this.filterSelectObj.filter((o) => {
          o.options = this.getFilterObject(this.task.data, o.columnProp);
        });
        this.task.filterPredicate = this.createFilter();
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
  }

  onDelete(taskId: string) {
    this.isLoading = true;
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.taskService.getTasks(this.tasksPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    this.task.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  filterChange(filter, event) {
    this.filterValues[
      filter.columnProp
    ] = event.target.value.trim().toLowerCase();
    this.task.filter = JSON.stringify(this.filterValues);
  }

  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  createFilter() {
    const filterFunction = function (data: any, filter: string): boolean {
      const searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== "") {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      const nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col]
              .trim()
              .toLowerCase()
              .split(" ")
              .forEach((word) => {
                if (
                  data[col].toString().toLowerCase().indexOf(word) != -1 &&
                  isFilterSet
                ) {
                  found = true;
                }
              });
          }
          return found;
        } else {
          return true;
        }
      };
      return nameSearch();
    };
    return filterFunction;
  }

  resetFilters() {
    this.filterValues = {};
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    });
    this.task.filter = "";
  }

  ngOnDestroy() {
    this.taskSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
