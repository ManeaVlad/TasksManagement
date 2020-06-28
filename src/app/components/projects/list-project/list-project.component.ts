import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { Project } from "../project.model";
import { ProjectService } from "../project.service";
import { PageEvent, MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-list-projects",
  templateUrl: "./list-project.component.html",
  styleUrls: ["./list-project.component.scss"],
})
export class ListProjectsComponent implements OnInit, OnDestroy {
  project: MatTableDataSource<any>;
  isLoading = false;
  totalProjects = 0;
  projectsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  searchKey: string;
  userId: string;
  private projectSub: Subscription;
  private authStatusSub: Subscription;
  displayedColumns: string[] = [
    "title",
    "creator",
    "state",
    "priority",
    "assignee",
    "startDate",
    "dueDate",
    "actions"
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.projectService.getProjects(this.projectsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.projectSub = this.projectService
      .getProjectUpdateListener()
      .subscribe(
        (projectData: { project: Project[]; projectCount: number }) => {
          this.isLoading = false;
          this.totalProjects = projectData.projectCount;
          this.project = new MatTableDataSource(projectData.project);
          this.project.sort = this.sort;
          this.project.paginator = this.paginator;
        }
      );
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
    this.projectsPerPage = pageData.pageSize;
    this.projectService.getProjects(this.projectsPerPage, this.currentPage);
  }

  onDelete(projectId: string) {
    this.isLoading = true;
    this.projectService.deleteProject(projectId).subscribe(
      () => {
        this.projectService.getProjects(this.projectsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    this.project.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  ngOnDestroy() {
    this.projectSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
