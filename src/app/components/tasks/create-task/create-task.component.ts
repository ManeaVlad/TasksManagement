import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.scss"]
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  projects = [
    {
      name: "MASCO-45"
    },
    {
      name: "CORO-34"
    },
    {
      name: "SOTO-46"
    }
  ];
  groupAsignee = [
    {
      name: "MASCO-45",
      users: [{name: "Manea Vlad"},{name: "Chirita Iulius"},{name: "Lulu Puf"}]
    },
    {
      name: "CORO-34",
      disabled: true,
      users: [{name: "Manea Vlad"},{name: "Chirita Iulius"},{name: "Lulu Puf"}]
    },
    {
      name: "SOTO-46",
      users: [{name: "Manea Vlad"},{name: "Chirita Iulius"},{name: "Lulu Puf"}]
    }
  ];
  private modes = {
    CREATE: "create",
    EDIT: "edit"
  };

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] })
    });
  }

  ngOnDestroy() {}
}
