import { Component } from "@angular/core";
import { Employee, niceForm } from "../employee";
import { FormsModule, NgForm, Validators } from "@angular/forms";
import { CommonModule, JsonPipe } from "@angular/common";
import { EmployeeService } from "../employee.service";
import { NiceFormComponent } from "../nice-form/nice-form.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-register",
  imports: [
    FormsModule,
    JsonPipe,
    CommonModule,
    NiceFormComponent,
    SidebarComponent,
  ],
  templateUrl: "./register.html",
  styles: ``,
})
export class RegisterComponent {
  formcontrol: niceForm[] = [
    {
      name: "username",
      type: "text",
      title: "User name",
      placeholder: "User name",
      default: "",
      validators: [Validators.required, Validators.min(3)],
    },
    {
      name: "firstname",
      type: "text",
      title: "First name",
      placeholder: "First name",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "lastname",
      type: "text",
      title: "Last name",
      placeholder: "Last name",
      default: "",
      validators: [Validators.required],
    },
    {
      name: "email",
      type: "text",
      title: "Email",
      placeholder: "Email",
      default: "",
      validators: [Validators.required, Validators.email],
    },

    {
      name: "phonenumber",
      type: "text",
      title: "Phone number",
      placeholder: "Phone number",
      default: "",
      validators: [Validators.required, Validators.pattern("[0-9]+")],
    },

    {
      name: "jobtitle",
      type: "text",
      title: "Job title",
      placeholder: "Job title",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "departmentid",
      type: "text",
      title: "Department ID",
      placeholder: "Department ID",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "salary",
      type: "text",
      title: "Salary",
      placeholder: "Salary",
      default: "",
      validators: [Validators.required],
    },

    {
      name: "password",
      type: "password",
      title: "Password",
      placeholder: "Password",
      default: "",
      validators: [Validators.required],
    },
  ];
  success_status: string = "NOT SUBMITTED";

  constructor(private employeeService: EmployeeService) {}

  register(data: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    jobtitle: string;
    departmentid: string;
    salary: string;
    password: string;
  }) {
    let employee: Employee = {
      userName: data.username,
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      phoneNumber: data.phonenumber,
      jobTitle: data.jobtitle,
      departmentId: "674573519322d092552e31a4", //data.departmentid,
      hireDate: "2024-11-26T10:21:38.124Z", //new Date().toString(),
      salary: parseInt(data.salary),
      status: "inactive",
    };

    console.log(employee);

    this.employeeService.addEmployee(employee).subscribe(
      (data) => {
        this.success_status = "SUCCESS";
      },
      (error) => {
        this.success_status = "ERROR";
      }
    );
  }
}
