import { Users } from "./users.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

const BACKEND_URL = "http://localhost:3000/api" + "/users/";

@Injectable({ providedIn: "root" })
export class UsersService {
  private user: Users[] = [];
  private userUpdated = new Subject<{
    user: Users[];
    userCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; user: any; maxUsers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((userData) => {
          return {
            user: userData.user.map((user) => {
              const userValue = user.google.id === "" ? user.local : user.google;
              return {
                userName: userValue.userName,
                id: user._id,
                email: userValue.email,
                companyName: userValue.companyName,
                isAdmin: userValue.isAdmin,
                activeUser: userValue.activeUser,
                phone: userValue.phone,
                role: userValue.role,
              };
            }),
            maxUsers: userData.maxUsers,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.user = transformedPostData.user;
        this.userUpdated.next({
          user: [...this.user],
          userCount: transformedPostData.maxUsers,
        });
      });
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      userName: string;
      email: string;
      companyName: string;
      isAdmin: boolean;
      activeUser: boolean;
      phone: string;
      role: string;
    }>(BACKEND_URL + id);
  }

  updateUser(
    id: string,
    userName: string,
    email: string,
    isAdmin: boolean,
    activeUser: boolean,
    phone: string,
    role: string
  ) {
    let userData: Users | FormData;
    userData = {
      id,
      userName,
      email,
      companyName: null,
      isAdmin,
      activeUser,
      phone,
      role,
    };
    this.http.patch(BACKEND_URL + id, userData).subscribe((response) => {
      this.router.navigate(["/users-table"]);
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(BACKEND_URL + userId);
  }
}
