import { Component, destroyPlatform } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { Department, niceForm } from "../../employee";
import { Validators } from "@angular/forms";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { retry } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-department",
  imports: [CommonModule, RouterLink, NiceFormComponent],
  templateUrl: "./department.html",
  styles: ``,
})
export class DepartmentComponent {
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  department!: Department;
  id!: string;

  ngOnInit() {
    this.getDepartment();
  }

  formcontrol!: niceForm[];

  strongstring(s: any) {
    return `<strong> ` + s + ` </strong>`;
  }

  InitForm() {
    this.formcontrol = [
      {
        name: "name",
        type: "text",
        title: "Name: " + this.strongstring(this.department.name),
        placeholder: "Name",
        default: "",
        validators: [Validators.required],
      },
      {
        name: "description",
        type: "text",
        title: "Description: " + this.strongstring(this.department.description),
        placeholder: "Description",
        default: "",
        validators: [Validators.required],
      },
    ];
  }

  getDepartment() {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get("id") || "";
      if (this.id != "") {
        this.employeeService
          .getDepartment(this.id)
          .subscribe((data: Department) => {
            this.department = data;
            this.InitForm();
          });
      }
    });
  }
  update(data: any) {
    this.department = {
      name: data.name,
      description: data.description,
    };
    this.employeeService.updateDepartment(this.id, this.department).subscribe(
      (data) => {
        this.InitForm();
      },
      (error) => {}
    );
    return null;
  }
  remove() {
    this.employeeService.deleteDepartment(this.id).subscribe(
      (data) => {
        this.router.navigate(["/departments"], { replaceUrl: true });
      },
      (error) => {}
    );
  }
}
