import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Notifications } from "./notifications.model";
import { Router } from "@angular/router";

const BACKEND_URL = "http://localhost:3000/api";

@Injectable({ providedIn: "root" })
export class HeaderService {
  private imageUser: string;
  private notification: Notifications[] = [];
  private notificationUpdated = new Subject<{
    notification: Notifications[];
    notificationCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getImagePath() {
    this.http.get<{ imagePath: string }>(BACKEND_URL);
  }

  getCompanyId() {
    return this.http.get<{ company: string }>(BACKEND_URL + "/companies/id/");
  }

  getNotifications() {
    this.http
      .get<{ message: string; notification: any; maxNotifications: number }>(
        BACKEND_URL + "/notifications/"
      )
      .pipe(
        map((notificationData) => {
          return {
            notification: notificationData.notification.map((notification) => {
              return {
                title: notification.title,
                dueDate: notification.dueDate,
                startDate: notification.startDate,
                assignee: notification.assignee,
                id: notification._id,
                company: notification.company,
                view: notification.view,
                taskId: notification.taskId,
              };
            }),
            maxNotifications: notificationData.maxNotifications,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.notification = transformedPostData.notification;
        this.notificationUpdated.next({
          notification: [...this.notification],
          notificationCount: transformedPostData.maxNotifications,
        });
      });
  }

  getNotificationUpdateListener() {
    return this.notificationUpdated.asObservable();
  }

  updateNotification(id: string) {
    this.http
      .patch(BACKEND_URL + "/notifications/" + id, "")
      .subscribe((response) => {
        this.router.navigate(["/list-projects"]);
      });
  }
}
