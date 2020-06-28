import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { CompanyData } from "./company-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

const BACKEND_URL = "http://localhost:3000/api" + "/users/";
const BACKEND = "http://localhost:3000/api";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private isAdmin = false;
  private token: string;
  private userName: string;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private userNameStatusListener = new Subject<string>();
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getUser() {
    return this.userName;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserNameStatusListener() {
    return this.userNameStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(body: AuthData) {
    this.http.post(BACKEND_URL + "signup", body).subscribe(
      () => {
        this.router.navigate(["/"]);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(body) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "login",
        body
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.getUserIsAdmin().subscribe(
              (isAdminUser) => {
                if (isAdminUser) {
                  this.isAdmin = true;
                  this.adminStatusListener.next(true);
                }
              },
              (error) => {
                this.adminStatusListener.next(false);
              }
            );
            this.getUserName().subscribe(
              (userValue) => {
                if (userValue) {
                  this.userName = String(userValue);
                  this.userNameStatusListener.next(this.userName);
                }
              },
              (error) => {
                this.userName = "Unknown";
                this.userNameStatusListener.next("Unknown");
              }
            );
            this.getCompanyForUser().subscribe(
              (company) => {
                if (company) {
                  this.isAuthenticated = true;
                  this.authStatusListener.next(true);
                  this.router.navigate(["/dashboard"]);
                } else {
                  this.router.navigate(["/auth/company-selection"]);
                }
              },
              (error) => {
                this.authStatusListener.next(false);
              }
            );
            this.userId = response.userId;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  googleAuthUser(tokenParam) {
    this.token = tokenParam;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `bearer ${tokenParam}`,
      }),
    };
    this.http
      .get<{ token: string; expiresIn: number; userId: string }>(
        BACKEND + "/auth/authenticate",
        httpOptions
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.getUserIsAdmin().subscribe(
              (isAdminUser) => {
                if (isAdminUser) {
                  this.isAdmin = true;
                  this.adminStatusListener.next(true);
                }
              },
              (error) => {
                this.adminStatusListener.next(false);
              }
            );
            this.getUserName().subscribe(
              (userValue) => {
                if (userValue) {
                  this.userName = String(userValue);
                  this.userNameStatusListener.next(this.userName);
                }
              },
              (error) => {
                this.userName = "Unknown";
                this.userNameStatusListener.next("Unknown");
              }
            );
            this.getCompanyForUser().subscribe(
              (company) => {
                if (company) {
                  this.isAuthenticated = true;
                  this.authStatusListener.next(true);
                  this.router.navigate(["/dashboard"]);
                } else {
                  this.router.navigate(["/auth/company-selection"]);
                }
              },
              (error) => {
                this.authStatusListener.next(false);
              }
            );
            this.userId = response.userId;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(["/auth/login"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }

  companySelection(body: CompanyData) {
    this.http.post(BACKEND + "/companies/company", body).subscribe(
      (response) => {
        this.updateUser(response);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  getCompanyForUser() {
    return this.http.get<{
      company: string;
    }>(BACKEND_URL + "getCompany");
  }

  updateUser(body) {
    this.http.patch(BACKEND_URL + "", body).subscribe(
      (response) => {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(["/dashboard"]);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  getUserIsAdmin() {
    return this.http.get<{
      isAdmin: boolean;
    }>(BACKEND_URL + "getIsAdmin");
  }

  getUserName() {
    return this.http.get<{
      userName: string;
    }>(BACKEND_URL + "getUserName");
  }
}
