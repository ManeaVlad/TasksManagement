import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ProjectService } from "../project.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Project } from "../project.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-show-project",
  templateUrl: "./show-project.component.html",
  styleUrls: ["./show-project.component.scss"],
})
export class ShowProjectComponent implements OnInit, OnDestroy {
  private projectId: string;
  public project: Project;
  form: FormGroup;
  usersPerPage = 2;
  currentPage = 1;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public projectService: ProjectService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("projectId")) {
        this.projectId = paramMap.get("projectId");
        this.isLoading = true;
        this.projectService.getProject(this.projectId).subscribe((postData) => {
          this.isLoading = false;
          this.project = {
            id: postData._id,
            title: postData.title,
            description: postData.description,
            imagePath: postData.imagePath,
            creator: postData.creator,
            priority: postData.priority,
            state: postData.state,
            assignee: postData.assignee,
            dueDate: postData.dueDate,
            startDate: postData.startDate,
            company: postData.company,
          };
        });
      }
    });
  }

  getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }

  onDelete(projectId: string) {
    this.isLoading = true;
    this.projectService.deleteProject(projectId).subscribe(
      () => {},
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
