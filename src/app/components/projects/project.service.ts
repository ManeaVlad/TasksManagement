import { Project } from "./project.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

const BACKEND_URL = "http://localhost:3000/api" + "/projects/";

@Injectable({ providedIn: "root" })
export class ProjectService {
  private project: Project[] = [];
  private projectUpdated = new Subject<{
    project: Project[];
    projectCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProjects(projectsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${projectsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; project: any; maxProjects: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((projectData) => {
          return {
            project: projectData.project.map((project) => {
              return {
                title: project.title,
                description: project.description,
                state: project.state,
                priority: project.priority,
                dueDate: project.dueDate,
                startDate: project.startDate,
                assignee: project.assignee,
                id: project._id,
                imagePath: project.imagePath,
                creator: project.creator,
                company: project.company,
              };
            }),
            maxProjects: projectData.maxProjects,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.project = transformedPostData.project;
        this.projectUpdated.next({
          project: [...this.project],
          projectCount: transformedPostData.maxProjects,
        });
      });
  }

  getProjectUpdateListener() {
    return this.projectUpdated.asObservable();
  }

  getProject(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      imagePath: string;
      creator: string;
      state: string;
      priority: string;
      assignee: string;
      dueDate: string;
      startDate: string;
      company: string;
    }>(BACKEND_URL + id);
  }

  addProject(
    title: string,
    description: string,
    image: File,
    priority: string,
    assignee: string,
    dueDate: string,
    startDate: string
  ) {
    const projectData = new FormData();
    projectData.append("title", title);
    projectData.append("description", description);
    projectData.append("image", image, title);
    projectData.append("priority", priority);
    projectData.append("assignee", assignee);
    projectData.append("dueDate", dueDate);
    projectData.append("startDate", startDate);
    this.http
      .post<{ message: string; project: Project }>(BACKEND_URL, projectData)
      .subscribe((responseData) => {
        this.router.navigate(["/list-projects"]);
      });
  }

  updateProject(
    id: string,
    title: string,
    description: string,
    image: File | string,
    state: string,
    priority: string,
    assignee: string,
    dueDate: string,
    startDate: string
  ) {
    let projectData: Project | FormData;
    if (typeof image === "object") {
      projectData = new FormData();
      projectData.append("id", id);
      projectData.append("title", title);
      projectData.append("description", description);
      projectData.append("image", image, title);
      projectData.append("state", state);
      projectData.append("priority", priority);
      projectData.append("assignee", assignee);
      projectData.append("dueDate", dueDate);
      projectData.append("startDate", startDate);
    } else {
      projectData = {
        id,
        title,
        description,
        imagePath: image,
        creator: null,
        state,
        priority,
        assignee,
        dueDate,
        startDate,
        company: null,
      };
    }
    this.http.patch(BACKEND_URL + id, projectData).subscribe((response) => {
      this.router.navigate(["/list-projects"]);
    });
  }

  deleteProject(projectId: string) {
    return this.http.delete(BACKEND_URL + projectId);
  }
}
