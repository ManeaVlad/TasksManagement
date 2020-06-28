import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { Users } from "../users.model";
import { UsersService } from "../users.service";
import {
  PageEvent,
  MatSort,
  MatTableDataSource,
  MatPaginator,
} from "@angular/material";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-list-users",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.scss"],
})
export class ListUsersComponent implements OnInit, OnDestroy {
  user: MatTableDataSource<any>;
  isLoading = false;
  totalUsers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  searchKey: string;
  userId: string;
  private userSub: Subscription;
  private authStatusSub: Subscription;
  displayedColumns: string[] = [
    "userName",
    "email",
    "role",
    "phone",
    "isAdmin",
    "activeUser",
    "actions"
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public userService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUsers(this.usersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((userData: { user: Users[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.user = new MatTableDataSource(userData.user);
        this.user.sort = this.sort;
        this.user.paginator = this.paginator;
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
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage);
  }

  onDelete(userId: string) {
    this.isLoading = true;
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.userService.getUsers(this.usersPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    this.user.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
