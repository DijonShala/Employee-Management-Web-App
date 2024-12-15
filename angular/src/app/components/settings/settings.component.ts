import { Component } from "@angular/core";
import { Employee, niceForm, Leave } from "../../employee";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { AsyncPipe, CommonModule, JsonPipe } from "@angular/common";

@Component({
  selector: "app-settings",
  imports: [NiceFormComponent, AsyncPipe, JsonPipe, CommonModule],
  templateUrl: "settings.html",
  styles: ``,
})
export class SettingsComponent {
  employee!: Employee;
  constructor(
    public employeeService: EmployeeService,
    private router: Router,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.setEmployee();
  }
  error: boolean = false;
  success: boolean = false;
  settingform: niceForm[] = [
    {
      name: "oldPassword",
      type: "password",
      title: "Old Password: ",
      placeholder: "********",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "newPassword",
      type: "password",
      title: "New Password: ",
      placeholder: "********",
      default: "",
      validators: [Validators.required],
    },
  ];

  setEmployee() {
    this.employeeService
      .getEmployee(this.employeeService.username)
      .subscribe((data) => {
        this.employee = data;
      });
  }

  changePass(formData: { oldPassword: string; newPassword: string }) {
  const { oldPassword, newPassword } = formData;

  if (oldPassword && newPassword) {
    this.employeeService.changePassword(oldPassword, newPassword ).subscribe(
      (response) => {
        this.success = true;
        this.error = false;
      },
      (error) => {
        this.success = false;
        this.error = true;
      }
    );
  } else {
    this.error = true;
    this.success = false;
  }
}
  
}
