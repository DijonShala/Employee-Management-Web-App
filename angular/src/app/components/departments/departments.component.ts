import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { Department, niceForm } from "../../employee";
import { Validators } from "@angular/forms";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { retry } from "rxjs";

@Component({
  selector: "app-departments",
  imports: [CommonModule, RouterLink, NiceFormComponent],
  templateUrl: "./departments.html",
  styles: ``,
})
export class DepartmentsComponent {
  constructor(public employeeService: EmployeeService) {}

  departments: Department[] = [];

  ngOnInit() {
    this.loadDepartments();
  }

  createDepartmentform: niceForm[] = [
    {
      name: "name",
      type: "text",
      title: "Name: ",
      placeholder: "Name",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "description",
      type: "text",
      title: "Description: ",
      placeholder: "Description",
      default: "",
      validators: [Validators.required],
    },
  ];

  loadDepartments() {
    this.employeeService
      .getDepartments()
      .pipe(retry(1))
      .subscribe(
        (departments: Department[]) => {
          this.departments = departments;
        },
        (error) => {
          console.error("Error loading departments:", error);
        }
      );
  }

  error: boolean = false;
  success: boolean = false;
  addDepartment(data: { name: string; description: string }) {
    this.employeeService.addDepartment(data).subscribe(
      (newDepartment: Department) => {
        this.error = false;
        this.success = true;

        this.departments.push(newDepartment);
      },
      (error) => {
        this.error = true;

        console.error("Error adding department:", error);
      }
    );
  }
}
