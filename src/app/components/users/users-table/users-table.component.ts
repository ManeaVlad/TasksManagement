import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import {
  PageEvent,
  MatSort,
  MatTableDataSource,
  MatPaginator,
  MatDialog,
} from "@angular/material";
import { AuthService } from "../../auth/auth.service";
import { Users } from "../users.model";
import { UsersCreateComponent } from "../users-create/users-create.component";

const ELEMENT_DATA: Users[] = [
  {
    userName: "Vlad",
    email: "Hydrogen",
    companyName: "1.0079",
    role: "H",
    isAdmin: false,
    activeUser: true,
  },
  {
    userName: "Vlad",
    email: "Helium",
    companyName: "bosii",
    role: "He",
    isAdmin: false,
    activeUser: true,
  },
  {
    userName: "Vlad",
    email: "Lithium",
    companyName: "bosii",
    role: "Li",
    isAdmin: true,
    activeUser: true,
  },
  {
    userName: "Vlad",
    email: "Beryllium",
    companyName: "bosii",
    role: "Be",
    isAdmin: false,
    activeUser: true,
  },
  {
    userName: "Vlad",
    email: "Beryllium",
    companyName: "bosii",
    role: "Be",
    isAdmin: false,
    activeUser: true,
  },
  {
    userName: "Vlad",
    email: "Beryllium",
    companyName: "bosii",
    role: "Be",
    isAdmin: false,
    activeUser: true,
  },
];
@Component({
  selector: "app-users-table",
  templateUrl: "./users-table.component.html",
  styleUrls: ["./users-table.component.scss"],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  userId: string;
  searchKey: string;
  displayedColumns: string[] = [
    "userName",
    "email",
    "companyName",
    "role",
    "isAdmin",
    "activeUser",
    "actions",
  ];
  usersData: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.usersData = new MatTableDataSource(ELEMENT_DATA);
    this.usersData.sort = this.sort;
    this.usersData.paginator = this.paginator;
  }

  onChangedPage(pageData: PageEvent) {}

  onDelete(postId: string) {}

  ngOnDestroy() {}

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UsersCreateComponent, {
      width: "300px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      // this.animal = result;
    });
  }

  applyFilter() {
    this.usersData.filter = this.searchKey.trim().toLowerCase();
  }
}
